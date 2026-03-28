import { post } from "../api/Client";
import { router } from "../router/router";
import type { RegisterPayload } from "../types/Auth";
import type { Profile } from "../types/Profile";
import { validateRegister } from "../utils/validation";

export async function RegisterPage(): Promise<HTMLElement> {
  const pageContainer = document.createElement('div');
  pageContainer.className = 'w-full flex flex-col items-center justify-center py-12';

  const card = document.createElement('div');
  card.className = 'w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-gray-100';

  const title = document.createElement('h2');
  title.textContent = 'Create Account';
  title.className = 'text-2xl font-bold text-center mb-2 text-navy font-sans md:text-3xl';

  const registerForm = document.createElement('form');
  registerForm.id = 'registerForm';
  registerForm.className = 'space-y-4';

  const formGroup = document.createElement('div');

  const nameLabel = document.createElement('label');
  nameLabel.textContent = 'Username';
  nameLabel.className = 'block text-sm font-medium text-navy';

  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.name = 'name';
  nameInput.required = true;
  nameInput.className = 'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy outline-none';

  formGroup.append(nameLabel, nameInput);

  const emailGroup = document.createElement('div');
  
  const emailLabel = document.createElement('label');
  emailLabel.textContent = 'Email';
  emailLabel.className = 'block text-sm font-medium text-navy';

  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.name = 'email';
  emailInput.required = true;
  emailInput.className = 'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy outline-none';

  emailGroup.append(emailLabel, emailInput);

  const passwordGroup = document.createElement('div');

  const passwordLabel = document.createElement('label');
  passwordLabel.textContent = 'Password';
  passwordLabel.className = 'block text-sm font-medium text-navy';

  const passwordInput = document.createElement('input');
  passwordInput.type = 'password';
  passwordInput.name = 'password';
  passwordInput.required = true;
  passwordInput.className = 'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy outline-none';

  const passwordValueText = document.createElement('p');
  passwordValueText.textContent = 'Password must be at least 8 characters.';
  passwordValueText.className = 'text-xs text-gray-400 pt-1 pl-1'
  

  passwordGroup.append(passwordLabel, passwordInput, passwordValueText);

  const errorMessage = document.createElement('p');
  errorMessage.className = 'text-sm text-error text-center hidden';

  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.textContent = 'Register';
  submitButton.className = 'button-primary cursor-pointer';

    const accountMessage = document.createElement('p');
  accountMessage.className = 'text-xs pl-1';

  const registerText = document.createTextNode('Already have an account? ');

  const registerLink = document.createElement('span');
  registerLink.textContent = 'Log In here.';
  registerLink.className = 'underline cursor-pointer text-navy';

  registerLink.addEventListener('click', () => {
    window.history.pushState({}, '', '/login');
    router();
  });

  accountMessage.append(registerText, registerLink);

  registerForm.append(formGroup, emailGroup, passwordGroup, errorMessage, submitButton, accountMessage);

  card.append(title, registerForm);
  pageContainer.appendChild(card);

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData: RegisterPayload = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      password: passwordInput.value,
    };

    errorMessage.textContent = '';
    errorMessage.classList.add('hidden');

    const validationError = validateRegister(formData);

    if (validationError) {
      errorMessage.textContent = validationError;
      errorMessage.classList.remove('hidden');
      return;
    }

    try {
await post<Profile, RegisterPayload>('auth/register', formData);
window.history.pushState({}, '', '/login');
router();
    }catch (error) {
      errorMessage.textContent = error instanceof Error ? error.message : 'Registration failed';
      errorMessage.classList.remove('hidden');
    }
    
  });
  return pageContainer;
}
