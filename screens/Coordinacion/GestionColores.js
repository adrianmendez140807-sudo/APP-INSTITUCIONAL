import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert, FlatList, TouchableOpacity } from 'react-native';
import dbService from '../../database';

const PREDEFINED_COLORS = [
  // Rojos y Rosas
  '#ffadad', '#ff8a80', '#ff80ab', '#ffc6ff', '#f8bbd0',
  // Naranjas y Amarillos
  '#ffd6a5', '#ffb080', '#ffcc80', '#ffe082', '#fdffb6',
  // Verdes
  '#caffbf', '#b9f6ca', '#a5d6a7', '#dcedc8', '#ccff90',
  // Azules
  '#9bf6ff', '#84ffff', '#80d8ff', '#a0c4ff', '#bbdefb',
  // Morados
  '#bdb2ff', '#b388ff', '##d1c4e9', '#c5cae9', '#e1bee7',
  // Grises y Neutros
  '#e9ecef', '#cfd8dc', '#f5f5f5', '#eeeeee', '#dcdcdc',
  // Colores más vivos
  '#ef5350', '#ff7043', '#ffca28', '#66bb6a', '#26c6da',
  '#5c6bc0', '#7e57c2', '#ec407a', '#78909c', '#bdbdbd',
];

const isValidHex = (color) => /^#([0-9A-F]{3}){1,2}$/i.test(color);

export default function GestionColores({ navigation }) {
  const [materia, setMateria] = useState('');
  const [selectedColor, setSelectedColor] = useState(PREDEFINED_COLORS[0]);
  const [customColor, setCustomColor] = useState('');
  const [colorMap, setColorMap] = useState({});

  const loadColors = useCallback(async () => {
    const colors = await dbService.getMateriaColores();
    setColorMap(colors);
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadColors();
    });
    return unsubscribe;
  }, [navigation, loadColors]);

  const handleSaveColor = async () => {
    const finalColor = isValidHex(customColor) ? customColor : selectedColor;

    if (!materia || !finalColor) {
      Alert.alert('Error', 'Debe ingresar un nombre de materia y seleccionar un color.');
      return;
    }
    try {
      await dbService.addOrUpdateMateriaColor(materia, finalColor);
      Alert.alert('Éxito', `Color guardado para la materia "${materia}".`);
      setMateria('');
      setCustomColor('');
      loadColors(); // Recargar la lista
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el color.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.colorRow, { backgroundColor: item.color }]}>
      <Text style={styles.materiaText}>{item.materia}</Text>
      <Text>{item.color}</Text>
    </View>
  );

  // Convertir el objeto a un array para el FlatList
  const colorList = Object.entries(colorMap).map(([materia, color]) => ({ materia, color }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Asignar Colores a Materias</Text>

      <View style={styles.formContainer}>
        <View style={styles.inputRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Nombre de la Materia:</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Matemáticas"
              value={materia}
              onChangeText={setMateria}
            />
          </View>
          <View>
            <Text style={styles.label}>Color:</Text>
            <View style={[styles.colorPreview, { backgroundColor: isValidHex(customColor) ? customColor : selectedColor }]} />
          </View>
        </View>

        <Text style={styles.label}>Seleccionar Color:</Text>
        <View style={styles.paletteContainer}>
          {PREDEFINED_COLORS.map(color => (
            <TouchableOpacity
              key={color}
              style={[ styles.colorBox, { backgroundColor: color }, selectedColor === color && !isValidHex(customColor) && styles.selectedBox, ]}
              onPress={() => {
                setSelectedColor(color);
                setCustomColor(''); // Limpiar color personalizado al elegir de la paleta
              }}
            />
          ))}
        </View>

        <Text style={styles.label}>O ingresa un código de color (hex):</Text>
          <TextInput
            style={styles.hexInput}
            placeholder="#RRGGBB"
            value={customColor}
            onChangeText={setCustomColor}
            maxLength={7}
          />

        <Button title="Guardar Color" onPress={handleSaveColor} />
      </View>

      <Text style={styles.subtitle}>Colores Asignados</Text>
      <FlatList
        data={colorList}
        renderItem={renderItem}
        keyExtractor={(item) => item.materia}
        ListEmptyComponent={<Text style={styles.emptyText}>Aún no has asignado colores.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  subtitle: { fontSize: 20, fontWeight: 'bold', marginTop: 30, marginBottom: 10, borderTopWidth: 1, borderColor: '#ddd', paddingTop: 10 },
  formContainer: { padding: 15, backgroundColor: '#fff', borderRadius: 10, elevation: 2 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  hexInput: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  paletteContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 15,
  },
  colorBox: {
    width: 35,
    height: 35,
    borderRadius: 8,
    margin: 4,
  },
  selectedBox: {
    borderWidth: 3,
    borderColor: '#000',
    transform: [{ scale: 1.1 }],
  },
  colorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    marginBottom: 8,
  },
  colorPreview: {
    width: 50,
    height: 45,
    borderRadius: 8,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  materiaText: {
    fontWeight: 'bold',
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
});