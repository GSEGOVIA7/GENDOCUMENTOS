import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { UserPlus } from 'lucide-react';

export default function ClientForm() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    cedula: '',
    address: '',
    city: '',
    neighborhood: '',
    workAddress: '',
    workNeighborhood: '',
    workCity: '',
    workplace: '',
    workPhone: '',
    creditAmount: '',
    returnAmount: '',
    companyProfit: '',
    agentProfit: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Check if client already exists
      const clientsRef = collection(db, 'clients');
      const q = query(clientsRef, where('cedula', '==', formData.cedula));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const existingClient = querySnapshot.docs[0].data();
        toast.error(`El cliente ya existe. Registrado por: ${existingClient.createdBy}`);
        return;
      }

      // Add new client
      await addDoc(clientsRef, {
        ...formData,
        creditAmount: parseFloat(formData.creditAmount),
        returnAmount: parseFloat(formData.returnAmount),
        companyProfit: parseFloat(formData.companyProfit),
        agentProfit: parseFloat(formData.agentProfit),
        createdAt: new Date(),
        createdBy: currentUser?.email
      });

      toast.success('Cliente registrado exitosamente');
      navigate('/clients');
    } catch (error) {
      toast.error('Error al registrar el cliente');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-center mb-8">
            <UserPlus className="h-12 w-12 text-indigo-600" />
            <h2 className="ml-3 text-3xl font-bold text-gray-900">Registro de Cliente</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre completo</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Fecha de nacimiento</label>
                <input
                  type="date"
                  name="birthDate"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.birthDate}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Número de cédula</label>
                <input
                  type="text"
                  name="cedula"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.cedula}
                  onChange={handleChange}
                />
              </div>

              {/* Personal Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Dirección</label>
                <input
                  type="text"
                  name="address"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Ciudad</label>
                <input
                  type="text"
                  name="city"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Barrio</label>
                <input
                  type="text"
                  name="neighborhood"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.neighborhood}
                  onChange={handleChange}
                />
              </div>

              {/* Work Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Dirección laboral</label>
                <input
                  type="text"
                  name="workAddress"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.workAddress}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Barrio laboral</label>
                <input
                  type="text"
                  name="workNeighborhood"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.workNeighborhood}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Ciudad laboral</label>
                <input
                  type="text"
                  name="workCity"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.workCity}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Lugar de trabajo</label>
                <input
                  type="text"
                  name="workplace"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.workplace}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Teléfono laboral</label>
                <input
                  type="tel"
                  name="workPhone"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.workPhone}
                  onChange={handleChange}
                />
              </div>

              {/* Financial Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Crédito a retirar</label>
                <input
                  type="number"
                  name="creditAmount"
                  required
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.creditAmount}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Monto a devolver</label>
                <input
                  type="number"
                  name="returnAmount"
                  required
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.returnAmount}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Utilidad empresa</label>
                <input
                  type="number"
                  name="companyProfit"
                  required
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.companyProfit}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Utilidad agente</label>
                <input
                  type="number"
                  name="agentProfit"
                  required
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.agentProfit}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Registrar Cliente
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}