import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Modal } from '../../../components/componentsreutilizables';
import { perfilAPI, clienteAPI } from '../api';
import { User, Mail, Phone, MapPin, Calendar, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

export const GestorPerfil: React.FC = () => {
  const [mostrarModalPassword, setMostrarModalPassword] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);
  
  const [datosPerfil, setDatosPerfil] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    fechaNacimiento: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    passwordActual: '',
    passwordNuevo: '',
    passwordConfirmacion: ''
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const cliente = await clienteAPI.obtenerCliente();
      setDatosPerfil({
        nombre: cliente.nombre,
        email: cliente.email,
        telefono: cliente.telefono || '',
        direccion: cliente.direccion || '',
        fechaNacimiento: cliente.fechaNacimiento 
          ? cliente.fechaNacimiento.toISOString().split('T')[0]
          : ''
      });
    } catch (error) {
      setMensaje({ tipo: 'error', texto: 'Error al cargar datos del perfil' });
    }
  };

  const handleGuardarPerfil = async () => {
    setCargando(true);
    setMensaje(null);
    
    try {
      await perfilAPI.actualizarPerfil({
        nombre: datosPerfil.nombre,
        email: datosPerfil.email,
        telefono: datosPerfil.telefono || undefined,
        direccion: datosPerfil.direccion || undefined,
        fechaNacimiento: datosPerfil.fechaNacimiento 
          ? new Date(datosPerfil.fechaNacimiento)
          : undefined
      });
      
      setMensaje({ tipo: 'success', texto: 'Perfil actualizado exitosamente' });
      
      setTimeout(() => setMensaje(null), 5000);
    } catch (error: any) {
      setMensaje({ tipo: 'error', texto: error.message || 'Error al actualizar el perfil' });
    } finally {
      setCargando(false);
    }
  };

  const handleCambiarPassword = async () => {
    setCargando(true);
    setMensaje(null);
    
    try {
      await perfilAPI.cambiarPassword(passwordData);
      setMensaje({ tipo: 'success', texto: 'Contraseña actualizada exitosamente' });
      setMostrarModalPassword(false);
      setPasswordData({
        passwordActual: '',
        passwordNuevo: '',
        passwordConfirmacion: ''
      });
      
      setTimeout(() => setMensaje(null), 5000);
    } catch (error: any) {
      setMensaje({ tipo: 'error', texto: error.message || 'Error al cambiar la contraseña' });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="space-y-6">
      {mensaje && (
        <Card className={`p-4 bg-white shadow-sm ${
          mensaje.tipo === 'success' 
            ? 'ring-1 ring-green-200 bg-green-50' 
            : 'ring-1 ring-red-200 bg-red-50'
        }`}>
          <div className="flex items-center gap-2">
            {mensaje.tipo === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
            <p className={`text-sm ${
              mensaje.tipo === 'success' ? 'text-green-700' : 'text-red-700'
            }`}>
              {mensaje.texto}
            </p>
          </div>
        </Card>
      )}

      <Card className="bg-white shadow-sm">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Información Personal
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Nombre completo"
              value={datosPerfil.nombre}
              onChange={(e) => setDatosPerfil({ ...datosPerfil, nombre: e.target.value })}
              leftIcon={<User className="w-5 h-5" />}
            />
            
            <Input
              label="Correo electrónico"
              type="email"
              value={datosPerfil.email}
              onChange={(e) => setDatosPerfil({ ...datosPerfil, email: e.target.value })}
              leftIcon={<Mail className="w-5 h-5" />}
            />
            
            <Input
              label="Teléfono"
              type="tel"
              value={datosPerfil.telefono}
              onChange={(e) => setDatosPerfil({ ...datosPerfil, telefono: e.target.value })}
              leftIcon={<Phone className="w-5 h-5" />}
            />
            
            <Input
              label="Fecha de nacimiento"
              type="date"
              value={datosPerfil.fechaNacimiento}
              onChange={(e) => setDatosPerfil({ ...datosPerfil, fechaNacimiento: e.target.value })}
              leftIcon={<Calendar className="w-5 h-5" />}
            />
          </div>

          <Input
            label="Dirección"
            value={datosPerfil.direccion}
            onChange={(e) => setDatosPerfil({ ...datosPerfil, direccion: e.target.value })}
            leftIcon={<MapPin className="w-5 h-5" />}
          />

          <div className="flex gap-4">
            <Button
              onClick={handleGuardarPerfil}
              loading={cargando}
              variant="primary"
            >
              Guardar Cambios
            </Button>
            
            <Button
              onClick={() => setMostrarModalPassword(true)}
              variant="secondary"
            >
              <Lock className="w-4 h-4 mr-2" />
              Cambiar Contraseña
            </Button>
          </div>
        </div>
      </Card>

      <Modal
        isOpen={mostrarModalPassword}
        onClose={() => setMostrarModalPassword(false)}
        title="Cambiar Contraseña"
        size="md"
        footer={
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => setMostrarModalPassword(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleCambiarPassword}
              loading={cargando}
            >
              Cambiar Contraseña
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Contraseña actual"
            type="password"
            value={passwordData.passwordActual}
            onChange={(e) => setPasswordData({ ...passwordData, passwordActual: e.target.value })}
            leftIcon={<Lock className="w-5 h-5" />}
          />
          
          <Input
            label="Nueva contraseña"
            type="password"
            value={passwordData.passwordNuevo}
            onChange={(e) => setPasswordData({ ...passwordData, passwordNuevo: e.target.value })}
            leftIcon={<Lock className="w-5 h-5" />}
            helperText="Mínimo 8 caracteres"
          />
          
          <Input
            label="Confirmar nueva contraseña"
            type="password"
            value={passwordData.passwordConfirmacion}
            onChange={(e) => setPasswordData({ ...passwordData, passwordConfirmacion: e.target.value })}
            leftIcon={<Lock className="w-5 h-5" />}
          />
        </div>
      </Modal>
    </div>
  );
};

