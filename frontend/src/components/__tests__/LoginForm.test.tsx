import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider } from '../../contexts/AuthContext';
import LoginForm from '../LoginForm';

// Mock the auth service
jest.mock('../../services/authService', () => ({
  authService: {
    login: jest.fn(),
    getCurrentUser: jest.fn(),
    getToken: jest.fn()
  }
}));

describe('LoginForm', () => {
  const mockOnSuccess = jest.fn();
  const mockOnRegisterClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderLoginForm = () => {
    return render(
      <AuthProvider>
        <LoginForm onSuccess={mockOnSuccess} onRegisterClick={mockOnRegisterClick} />
      </AuthProvider>
    );
  };

  it('renders login form with all elements', () => {
    renderLoginForm();

    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByText('Sign in to continue learning Greek')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
  });

  it('handles successful login', async () => {
    const { authService } = require('../../services/authService');
    authService.login.mockResolvedValueOnce(undefined);
    authService.getCurrentUser.mockResolvedValueOnce({
      id: 1,
      email: 'test@example.com'
    });

    renderLoginForm();

    await userEvent.type(screen.getByRole('textbox', { name: /email/i }), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');

    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
    });

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('handles login error', async () => {
    const { authService } = require('../../services/authService');
    authService.login.mockRejectedValueOnce(new Error('Invalid credentials'));

    renderLoginForm();

    await userEvent.type(screen.getByRole('textbox', { name: /email/i }), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'wrongpassword');

    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
    });
  });

  it('calls onRegisterClick when sign up button is clicked', () => {
    renderLoginForm();

    fireEvent.click(screen.getByRole('button', { name: 'Sign up' }));
    expect(mockOnRegisterClick).toHaveBeenCalled();
  });
});
