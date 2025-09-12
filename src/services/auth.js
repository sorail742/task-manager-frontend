// frontend/services/auth.js
import api from './api'

export const login = (data) => api.post('/auth/login', data)

export const register = (data) => api.post('/auth/register', data)

// 🔹 Création d'un membre (accessible à tout utilisateur connecté)
export const createMember = (data) => api.post('/auth/members', data)

// 🔹 Création d'un admin (seulement si l’utilisateur connecté est admin)
export const createAdmin = (data) => api.post('/auth/admin', data)

// 🔹 Récupérer son profil
export const getMyProfile = () => api.get('/auth/me')

// 🔹 Récupérer tous les utilisateurs (admin uniquement)
export const getAllUsers = () => api.get('/users')

// 🔹 Supprimer un utilisateur (admin uniquement)
export const deleteUser = (id) => api.delete(`/users/${id}`)
