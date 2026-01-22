// Device Fingerprinting Utility
// Generates unique identifier for trusted device management

export async function generateDeviceFingerprint() {
  const components = [
    navigator.userAgent,
    navigator.language,
    new Date().getTimezoneOffset(),
    screen.height,
    screen.width,
    screen.colorDepth,
    navigator.hardwareConcurrency || 0,
    navigator.deviceMemory || 0,
    navigator.maxTouchPoints || 0,
  ];

  // Add canvas fingerprint
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.textBaseline = 'top';
  ctx.font = '14px Arial';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#f60';
  ctx.fillRect(125, 1, 62, 20);
  ctx.fillStyle = '#069';
  ctx.fillText('BeeZee', 2, 15);
  ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
  ctx.fillText('BeeZee', 4, 17);
  components.push(canvas.toDataURL());

  // Combine and hash
  const fingerprint = await hash(components.join('|||'));
  return fingerprint;
}

async function hash(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export async function isTrustedDevice(fingerprint, userId, supabase) {
  try {
    const { data, error } = await supabase
      .from('trusted_devices')
      .select('*')
      .eq('user_id', userId)
      .eq('device_fingerprint', fingerprint)
      .eq('is_active', true)
      .gte('trusted_until', new Date().toISOString())
      .single();

    if (error || !data) {
      return false;
    }

    // Update last_used_at
    await supabase
      .from('trusted_devices')
      .update({ last_used_at: new Date().toISOString() })
      .eq('id', data.id);

    return true;
  } catch (error) {
    console.error('Error checking trusted device:', error);
    return false;
  }
}

export async function trustDevice(userId, deviceName, supabase) {
  try {
    const fingerprint = await generateDeviceFingerprint();

    const { error } = await supabase
      .from('trusted_devices')
      .insert({
        user_id: userId,
        device_fingerprint: fingerprint,
        device_name: deviceName || 'Current Device',
        device_type: /mobile/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
        browser: getBrowserName(),
        os: getOSName(),
      });

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Error trusting device:', error);
    return false;
  }
}

export async function revokeTrustedDevice(deviceId, supabase) {
  try {
    const { error } = await supabase
      .from('trusted_devices')
      .update({ is_active: false })
      .eq('id', deviceId);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Error revoking device:', error);
    return false;
  }
}

function getBrowserName() {
  const ua = navigator.userAgent;
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari')) return 'Safari';
  if (ua.includes('Edge')) return 'Edge';
  return 'Unknown';
}

function getOSName() {
  const ua = navigator.userAgent;
  if (ua.includes('Windows')) return 'Windows';
  if (ua.includes('Mac')) return 'macOS';
  if (ua.includes('Linux')) return 'Linux';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iOS')) return 'iOS';
  return 'Unknown';
}


