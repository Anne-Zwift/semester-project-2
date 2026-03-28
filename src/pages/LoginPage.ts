import { post } from '../api/Client';
import { router } from '../router/router';
import type { LoginPayLoad } from '../types/Auth';
import type { Profile } from '../types/Profile';
import { validateLogin } from '../utils/validation';
import { store } from '../utils/store';

export async function LoginPage(): Promise<HTMLElement> {
  const pageContainer = document.createElement('div');
  pageContainer.className =
    'w-full flex flex-col items-center justify-center py-12';

  const card = document.createElement('div');
  card.className =
    'w-full max-w-md bg-white rounded-xl shadow-lg p-8 border-gray-100';

  const title = document.createElement('h2');
  title.textContent = 'Log In';
  title.className =
    'text-2xl font-bold text-center mb-2 text-navy font-sans md:text-3xl';

  const loginForm = document.createElement('form');
  loginForm.id = 'loginForm';
  loginForm.className = 'space-y-4';

  const emailGroup = document.createElement('div');

  const emailLabel = document.createElement('label');
  emailLabel.textContent = 'Email';
  emailLabel.className = 'block text-sm font-medium text-navy';

  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.name = 'email';
  emailInput.required = true;
  emailInput.className =
    'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy outline-none';

  emailGroup.append(emailLabel, emailInput);

  const passwordGroup = document.createElement('div');

  const passwordLabel = document.createElement('label');
  passwordLabel.textContent = 'Password';
  passwordLabel.className = 'block text-sm font-medium text-navy';

  const passwordInput = document.createElement('input');
  passwordInput.type = 'password';
  passwordInput.name = 'password';
  passwordInput.required = true;
  passwordInput.className =
    'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy outline-none';

  passwordGroup.append(passwordLabel, passwordInput);

  const errorMessage = document.createElement('p');
  errorMessage.className = 'text-sm text-error text-center hidden';

  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.textContent = 'Log In';
  submitButton.className = 'button-primary cursor-pointer';

  const accountMessage = document.createElement('p');
  accountMessage.className = 'text-xs';

  const registerText = document.createTextNode('No account yet? ');

  const registerLink = document.createElement('span');
  registerLink.textContent = 'Register here.';
  registerLink.className = 'underline cursor-pointer text-navy';

  registerLink.addEventListener('click', () => {
    window.history.pushState({}, '', '/register');
    router();
  });

  accountMessage.append(registerText, registerLink);

  loginForm.append(
    emailGroup,
    passwordGroup,
    errorMessage,
    submitButton,
    accountMessage,
  );

  card.append(title, loginForm);
  pageContainer.appendChild(card);

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData: LoginPayLoad = {
      email: emailInput.value.trim(),
      password: passwordInput.value,
    };

    errorMessage.textContent = '';
    errorMessage.classList.add('hidden');

    const validationError = validateLogin(formData);

    if (validationError) {
      errorMessage.textContent = validationError;
      errorMessage.classList.remove('hidden');
      return;
    }

    try {
      const response = await post<
        Profile & { accessToken: string },
        LoginPayLoad
      >('auth/login', formData);

      if (response?.data) {
        const { accessToken, ...profile } = response.data;
        store.saveLogin(profile, accessToken);

        window.history.pushState({}, '', '/');
        router();
      }
    } catch (error) {
      errorMessage.textContent =
        error instanceof Error ? error.message : 'Log in failed';
      errorMessage.classList.remove('hidden');
    }
  });

  return pageContainer;
}
