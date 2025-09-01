import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Pantallas
import LoadingScreen from '../screens/Otros/LoadingScreen';
import LoginScreen from '../screens/Otros/LoginScreen';
import AdminHomeScreen from '../screens/Otros/AdminScreen';
import SecretariaHome from '../screens/Secretaria/SecretariaHome';
import CoordinadorHome from '../screens/Coordinacion/CoordinadorHome';
import RectorHome from '../screens/Rectoria/RectorHome';
import DocenteHome from '../screens/Docente/DocenteHome';
import AñadirEstudiante from '../screens/Secretaria/Estudiantes1/AñadirEstudiante';
import AgregarDocente from '../screens/Secretaria/Docentes1/AgregarDocente';
import ListaDocentes from '../screens/Secretaria/Docentes1/ListaDocentes';
import ListaEstudiantes from '../screens/Secretaria/Estudiantes1/ListaEstudiantes';
import BaseDatosEstudiantes from '../screens/Secretaria/Estudiantes1/DataBaseStudent';
import DeshabilitarNotas from '../screens/Secretaria/GestionNotas/DeshabilitarNotas';
import HabilitarNotas from '../screens/Secretaria/GestionNotas/HabilitarNotas';
import GestionNotas from '../screens/Secretaria/GestionNotas/GestionNotasPU';
import CircularesAvisos from '../screens/Secretaria/Comunicacion/CircularesAvisos';
import MensajesEstudiantes from '../screens/Secretaria/Comunicacion/MensajesEstudiantes';
import ArchivosDigitales from '../screens/Secretaria/Documentos/ArchivosDigitales';
import GestionarLibros from '../screens/Secretaria/Documentos/GestionarLibros';
import GenerarReportes from '../screens/Secretaria/Reportes/GenerarReportes';
import ReportesAsistencias from '../screens/Secretaria/Reportes/ReportesAsistencias';
import DocumentosOficiales from '../screens/Secretaria/Documentos/DocumentosOficiales';
import StudentHome from '../screens/Estudiante/StudentHome';
import BaseDatosDocentes from '../screens/Secretaria/Docentes1/DataBaseTeacher';
import BaseDatosDocentes1 from '../screens/Secretaria/Docentes1/DataBaseTeacher';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: true }}>
      <Stack.Screen name="Loading" component={LoadingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Iniciar sesión', headerShown: false }} />
      <Stack.Screen name="AdminHome" component={AdminHomeScreen} options={{ title: 'Administrador' }} />
      <Stack.Screen name="SecretariaHome" component={SecretariaHome} options={{ title: 'Secretaría' }} />
      <Stack.Screen name="CoordinadorHome" component={CoordinadorHome} options={{ title: 'Coordinación' }} />
      <Stack.Screen name="RectorHome" component={RectorHome} options={{ title: 'Rectoría' }} />
      <Stack.Screen name="DocenteHome" component={DocenteHome} options={{ title: 'Docente' }} />

      {/*Rutas de Estudiante */}
      <Stack.Screen name="StudentHome" component={StudentHome} options={{ title: 'Estudiante' }} />

      {/* Rutas de secretaria */}
      <Stack.Screen name="Estudiante" component={AñadirEstudiante} options={{ title: 'Agregar Estudiante' }} />
      <Stack.Screen name="AgregarDocente" component={AgregarDocente} options={{ title: 'Agregar Docente' }} />
      <Stack.Screen name="ListaDocentes" component={ListaDocentes} options={{ title: 'Docentes' }} />
      <Stack.Screen name="ListaEstudiantes" component={ListaEstudiantes} options={{ title: 'Estudiantes' }} />
      <Stack.Screen name="BaseDatosEstudiantes" component={BaseDatosEstudiantes} options={{ title: 'BDEs' }} />
      <Stack.Screen name="DeshabilitarNotas" component={DeshabilitarNotas} options={{ title: 'DN' }} />
      <Stack.Screen name="GestionNotas" component={GestionNotas} options={{ title: 'GN' }} />
      <Stack.Screen name="HabilitarNotas" component={HabilitarNotas} options={{ title: 'HN' }} />
      <Stack.Screen name="CircularesAvisos" component={CircularesAvisos} options={{ title: 'CA'}}/>
      <Stack.Screen name="MensajesEstudiantes" component={MensajesEstudiantes} options={{ title: 'ME'}}/>
      <Stack.Screen name="ArchivosDigitales" component={ArchivosDigitales} options={{ title: 'AD'}}/>
      <Stack.Screen name="DocumentosOficiales" component={DocumentosOficiales} options={{ title: 'DO'}}/>
      <Stack.Screen name="GestionarLibros" component={GestionarLibros} options={{ title: 'GL'}}/>
      <Stack.Screen name="GenerarReportes" component={GenerarReportes} options={{ title: 'GR'}}/>
      <Stack.Screen name="ReportesAsistencias" component={ReportesAsistencias} options={{ title: 'RA'}}/>
      <Stack.Screen name="BaseDatosDocentes" component={BaseDatosDocentes1} options={{ title: 'BaseDatosDocentes' }} />
    </Stack.Navigator>
  );
}
