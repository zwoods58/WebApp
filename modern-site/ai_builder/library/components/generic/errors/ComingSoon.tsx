/**
 * ComingSoon - Coming soon page component
 * Converted from generic/coming-soon.html
 */

import React, { useState, useEffect } from 'react'

export interface ComingSoonProps {
  title?: string
  subtitle?: string
  launchDate?: string
  emailPlaceholder?: string
  buttonText?: string
  onNotify?: (email: string) => void | Promise<void>
  primaryColor?: string
}
