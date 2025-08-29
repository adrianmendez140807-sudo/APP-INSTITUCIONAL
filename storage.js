import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveData = async (key, data) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error guardando datos:', error);
  }
};

export const loadData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : [];
  } catch (error) {
    console.error('Error cargando datos:', error);
    return [];
  }
};

export const deleteItem = async (key, id) => {
  try {
    const items = await loadData(key);
    const filtered = items.filter(item => item.id !== id);
    await saveData(key, filtered);
    return filtered;
  } catch (error) {
    console.error('Error eliminando elemento:', error);
  }
};
