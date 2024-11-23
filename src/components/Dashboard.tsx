import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserPlus, Users, LogOut, Settings } from 'lucide-react';

export default function Dashboard() {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-indigo-600">Sistema de Gestión</h1>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 mr-4">{currentUser?.email}</span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              to="/clients/new"
              className="bg-white overflow-hidden shadow rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center">
                <UserPlus className="h-8 w-8 text-indigo-600" />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Nuevo Cliente</h3>
                  <p className="mt-1 text-sm text-gray-500">Registrar un nuevo cliente en el sistema</p>
                </div>
              </div>
            </Link>

            <Link
              to="/clients"
              className="bg-white overflow-hidden shadow rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center">
                <Users className="h-8 w-8 text-indigo-600" />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Lista de Clientes</h3>
                  <p className="mt-1 text-sm text-gray-500">Ver y gestionar todos los clientes</p>
                </div>
              </div>
            </Link>

            {currentUser?.role === 'admin' && (
              <Link
                to="/users"
                className="bg-white overflow-hidden shadow rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center">
                  <Settings className="h-8 w-8 text-indigo-600" />
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Gestión de Usuarios</h3>
                    <p className="mt-1 text-sm text-gray-500">Administrar roles y permisos</p>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}