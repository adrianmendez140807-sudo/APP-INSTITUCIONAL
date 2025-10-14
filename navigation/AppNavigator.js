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
import BaseDatosDocentes1 from '../screens/Secretaria/Docentes1/DataBaseTeacher';
import NotasImportantes from '../screens/Estudiante/BlockNotas/NotasImportantes';
import DocenteMateria from '../screens/Estudiante/Grupos/DocenteMateria';
import DocentList from '../screens/Estudiante/Docentes/DocentList';
import Apuntes from '../screens/Estudiante/BlockNotas/Apuntes';
import Informaciones from '../screens/Estudiante/ActividadesInformacion/Informaciones';
import Avisos from '../screens/Estudiante/ActividadesInformacion/Avisos';
import HorarioGeneral1 from '../screens/Estudiante/Horario/HorarioGeneral';
import CambioHorario1 from '../screens/Estudiante/Horario/CambioHorario';
import Razones1 from '../screens/Estudiante/Horario/Razones';
import MateriasDocentes1 from '../screens/Estudiante/Materias/MateriasDocentes';
import Notas1 from '../screens/Estudiante/Materias/Notas';
import TotalMaterias1 from '../screens/Estudiante/Materias/TotalMaterias';
import StudentsGroup1 from '../screens/Estudiante/Grupos/StudentsGroup';
import DetallesNotasEstudiante from '../screens/Secretaria/GestionNotas/DetallesNotasEstudiante';
import ListadoDeEstudiantes from '../screens/Docente/Estudiantes/ListadoDeEstudiantes';
import GrupoEstudiantes from '../screens/Docente/Comunicacion/GrupoEstudiantes';
import GrupoDirectivas from '../screens/Docente/Comunicacion/GrupoDirectivas';
import AnotacionesYNotas from '../screens/Docente/Estudiantes/AnotacionesYNotas';
import MateriasRegistradas from '../screens/Docente/Materias/MateriasRegistradas';
import PlanDeArea from '../screens/Docente/Materias/PlanArea';
import RegistrarMaterias from '../screens/Docente/Materias/RegistrarMaterias';
import PublicarNotas from '../screens/Docente/Notas/PublicarNotas';
import PlanArea from '../screens/Docente/Materias/PlanArea';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: true }}>
      <Stack.Screen name="Loading" component={LoadingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Iniciar sesión', headerShown: false }} />
      <Stack.Screen name="AdminHome" component={AdminHomeScreen} options={{ title: 'Administrador' }} />

      {/*Rutas usadas dentro de Coordinación */}
      <Stack.Screen name="CoordinadorHome" component={CoordinadorHome} options={{ title: 'Coordinación' }} />

      {/*Rutas usadas dentro de Rectoría */}
      <Stack.Screen name="RectorHome" component={RectorHome} options={{ title: 'Rectoría' }} />

      {/*Rutas usadas dentro de Docente */}
      <Stack.Screen name="DocenteHome" component={DocenteHome} options={{ title: 'Docente' }} />
      <Stack.Screen name="ListadoDeEstudiantes" component={ListadoDeEstudiantes} options={{ title: 'Listado de Estudiantes' }} />
      <Stack.Screen name="GrupoEstudiantes" component={GrupoEstudiantes} options={{ title: 'Grupos con Estudiantes' }} />
      <Stack.Screen name="GrupoDirectivas" component={GrupoDirectivas} options={{ title: 'Grupo con Directivas' }} />
      <Stack.Screen name="AnotacionesYNotas" component={AnotacionesYNotas} options={{ title: 'Anotaciones y Notas' }} />
      <Stack.Screen name="MateriasRegistradas" component={MateriasRegistradas} options={{ title: 'Materias Registradas' }} />
      <Stack.Screen name="PlanArea" component={PlanArea} options={{ title: 'Plan de Área' }} />
      <Stack.Screen name="RegistrarMaterias" component={RegistrarMaterias} options={{ title: 'Registrar Materias' }} />
      <Stack.Screen name="PublicarNotas" component={PublicarNotas} options={{ title: 'Publicar Notas' }} />

      {/*Rutas usadas dentro de Estudiante */}
      <Stack.Screen name="StudentHome" component={StudentHome} options={{ title: 'Estudiante' }} />
      <Stack.Screen name="HorarioGeneral" component={HorarioGeneral1} options={{ title: 'Horario General' }} />
      <Stack.Screen name="CambioHorario" component={CambioHorario1} options={{ title: 'Cambio de Horario' }} />
      <Stack.Screen name="Razones" component={Razones1} options={{ title: 'Razones' }} />
      <Stack.Screen name="MateriasDocentes" component={MateriasDocentes1} options={{ title: 'Materias por Docente' }} />
      <Stack.Screen name="Notas" component={Notas1} options={{ title: 'Notas' }} />
      <Stack.Screen name="TotalMaterias" component={TotalMaterias1} options={{ title: 'Total de Materias' }} />
      <Stack.Screen name="NotasImportantes" component={NotasImportantes} options={{ title: 'Notas Importantes' }} />
      <Stack.Screen name="StudentsGroup" component={StudentsGroup1} options={{ title: 'Grupo de Estudiantes' }} />
      <Stack.Screen name="DocenteMateria" component={DocenteMateria} options={{ title: 'Docente por Materia' }} />
      <Stack.Screen name="DocentesList" component={DocentList} options={{ title: 'Lista de Docentes' }} />
      <Stack.Screen name="Apuntes" component={Apuntes} options={{ title: 'Apuntes' }} />
      <Stack.Screen name="Informes" component={Informaciones} options={{ title: 'Informes' }} />
      <Stack.Screen name="Avisos" component={Avisos} options={{ title: 'Avisos' }} />

      {/* Rutas usadas dentro de secretaria */}
      <Stack.Screen name="Estudiante" component={AñadirEstudiante} options={{ title: 'Agregar Estudiante' }} />
      <Stack.Screen name="AgregarDocente" component={AgregarDocente} options={{ title: 'Agregar Docente' }} />
      <Stack.Screen name="ListaDocentes" component={ListaDocentes} options={{ title: 'Docentes' }} />
      <Stack.Screen name="ListaEstudiantes" component={ListaEstudiantes} options={{ title: 'Estudiantes' }} />
      <Stack.Screen name="BaseDatosEstudiantes" component={BaseDatosEstudiantes} options={{ title: 'BDEs' }} />
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
      <Stack.Screen name="SecretariaHome" component={SecretariaHome} options={{ title: 'Secretaría' }} />
      <Stack.Screen name="DetallesNotasEstudiante" component={DetallesNotasEstudiante} options={{ title: 'Detalles de Notas' }} />
    </Stack.Navigator>
  );
}
