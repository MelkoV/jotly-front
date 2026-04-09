import { mockUser } from '../data/mockItems'

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms))

function createResponse(data, message) {
  return { data, message }
}

export async function signInRequest(credentials) {
  await delay(700)

  if (credentials.email !== mockUser.email || credentials.password.length < 6) {
    throw new Error(
      'Неверный email или пароль. Используйте тестовый аккаунт alexey@jotly.app и пароль не короче 6 символов.',
    )
  }

  return createResponse(
    {
      user: mockUser,
      remember: credentials.remember,
      token: 'mock-session-token',
    },
    'Вход выполнен',
  )
}

export async function signUpRequest(payload) {
  await delay(800)

  if (payload.email === mockUser.email) {
    throw new Error('Пользователь с таким email уже зарегистрирован.')
  }

  return createResponse(
    {
      user: {
        id: 'user-new',
        name: payload.name,
        email: payload.email,
      },
      token: 'mock-session-token',
    },
    'Регистрация прошла успешно',
  )
}

export async function updateProfileNameRequest(payload) {
  await delay(500)

  if (payload.name.trim().length < 2) {
    throw new Error('Имя должно содержать минимум 2 символа.')
  }

  return createResponse({ ...mockUser, name: payload.name.trim() }, 'Имя обновлено')
}

export async function changePasswordRequest(payload) {
  await delay(650)

  if (payload.currentPassword !== 'password123') {
    throw new Error('Текущий пароль указан неверно.')
  }

  return createResponse(null, 'Пароль успешно изменен')
}
