# How to Disable Email Confirmation in Supabase

If you want users to be immediately authenticated after signup (without email confirmation), you need to disable email confirmation in your Supabase project settings.

## Steps to Disable Email Confirmation:

1. **Go to your Supabase Dashboard**
   - Navigate to https://app.supabase.com/
   - Select your project

2. **Open Authentication Settings**
   - Click on **Authentication** in the left sidebar
   - Click on **Settings** (or go to **Authentication** → **Settings**)

3. **Disable Email Confirmation**
   - Scroll down to the **Email Auth** section
   - Find the toggle for **"Enable email confirmations"** or **"Confirm email"**
   - **Turn it OFF** (disable it)

4. **Save Changes**
   - Click **Save** or the changes will auto-save

## Alternative: Use Magic Links (No Password)

If you prefer, you can also use magic links instead of passwords, which don't require email confirmation in the same way.

## Important Notes:

- **Development/Testing**: It's fine to disable email confirmation for development and testing
- **Production**: Consider keeping it enabled for production to prevent spam accounts
- **Security**: Disabling email confirmation means anyone with an email address can create an account
- **User Experience**: Disabling it provides a smoother, faster signup experience

## After Disabling:

Once you disable email confirmation:
- Users will be immediately authenticated after signup
- The `data.session` will be available immediately
- Users can start using the app right away
- The header will update to show they're logged in

## Testing:

After disabling email confirmation, test the signup flow:
1. Go to `/ai-builder/signup`
2. Fill out the form and submit
3. You should be immediately redirected to the builder form
4. The header should show your name/email instead of "Login"
5. You should be able to click "START BUILD" without seeing the login modal


