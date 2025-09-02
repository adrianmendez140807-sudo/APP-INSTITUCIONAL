import React, { useState, useRef, useEffect } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  StyleSheet, 
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StatusBar
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import dbService from "../../database";

const { width, height } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  
  // Animaciones
  const eyeAnimation = useRef(new Animated.Value(0)).current;
  const headAnimation = useRef(new Animated.Value(0)).current;
  const blinkAnimation = useRef(new Animated.Value(1)).current;
  const handsAnimation = useRef(new Animated.Value(0)).current;

  // Animación de parpadeo
  useEffect(() => {
    const blink = () => {
      Animated.sequence([
        Animated.timing(blinkAnimation, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnimation, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    };

    const blinkInterval = setInterval(blink, 3000);
    return () => clearInterval(blinkInterval);
  }, []);

  // Animación cuando se enfoca la contraseña
  useEffect(() => {
    if (isPasswordFocused) {
      // Mover cabeza hacia abajo y mostrar manos tapando ojos
      Animated.parallel([
        Animated.timing(headAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(handsAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Volver a posición normal
      Animated.parallel([
        Animated.timing(headAnimation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(handsAnimation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isPasswordFocused]);

  // Animación de seguimiento de ojos
  const handleEmailFocus = () => {
    if (!isPasswordFocused) {
      Animated.timing(eyeAnimation, {
        toValue: 0.5,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleInputBlur = () => {
    if (!isPasswordFocused) {
      Animated.timing(eyeAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleLogin = async () => {
    const user = await dbService.getUserByLogin(email, password);
    if (user) {
      switch (user.role) {
        case 'docente':
          navigation.navigate('DocenteHome');
          break;
        case 'estudiante':
          navigation.navigate('StudentHome');
          break;
        case 'coordinador':
          navigation.navigate('CoordinadorHome');
          break;
        case 'rector':
          navigation.navigate('RectorHome');
          break;
        case 'secretaria':
          navigation.navigate('SecretariaHome');
          break;
        case 'admin':
          navigation.navigate('AdminHome');
          break;
        default:
          Alert.alert('Error', 'Rol de usuario no reconocido');
      }
    } else {
      Alert.alert('Error', 'Usuario o contraseña incorrectos');
    }
  };

  const BearAvatar = () => {
    const headTransform = headAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 10],
    });

    const handsOpacity = handsAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    const eyeTransformX = eyeAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 4],
    });

    return (
      <View style={styles.avatarContainer}>
        <Animated.View 
          style={[
            styles.bearHead,
            { transform: [{ translateY: headTransform }] }
          ]}
        >
          {/* Birrete */}
          <View style={styles.birrete}>
            <View style={styles.birreteTop} />
            <View style={styles.birreteTassel} />
          </View>
          
          {/* Orejas */}
          <View style={styles.earsContainer}>
            <View style={styles.ear}>
              <View style={styles.innerEar} />
            </View>
            <View style={styles.ear}>
              <View style={styles.innerEar} />
            </View>
          </View>
          
          {/* Cabeza */}
          <View style={styles.face}>
            {/* Ojos */}
            <View style={styles.eyesContainer}>
              <Animated.View 
                style={[
                  styles.eye,
                  { 
                    opacity: blinkAnimation,
                    transform: [{ translateX: eyeTransformX }]
                  }
                ]}
              >
                <View style={styles.pupil} />
              </Animated.View>
              <Animated.View 
                style={[
                  styles.eye,
                  { 
                    opacity: blinkAnimation,
                    transform: [{ translateX: eyeTransformX }]
                  }
                ]}
              >
                <View style={styles.pupil} />
              </Animated.View>
            </View>
            
            {/* Hocico */}
            <View style={styles.snout}>
              <View style={styles.nose} />
              <View style={styles.mouth} />
            </View>
          </View>
          
          {/* Patas tapando ojos */}
          <Animated.View 
            style={[
              styles.paws,
              { opacity: handsOpacity }
            ]}
          >
            <View style={styles.paw} />
            <View style={styles.paw} />
          </Animated.View>
        </Animated.View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      
      <View style={styles.backgroundGradient}>
        <View style={styles.topSection}>
          <BearAvatar />
          <Text style={styles.title}>Acceso Institucional</Text>
          <Text style={styles.subtitle}>Ingresa tus credenciales</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#8F9BB3" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor="#8F9BB3"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              onFocus={handleEmailFocus}
              onBlur={handleInputBlur}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#8F9BB3" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Contraseña"
              placeholderTextColor="#8F9BB3"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons 
                name={showPassword ? "eye-outline" : "eye-off-outline"} 
                size={20} 
                color="#8F9BB3" 
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Ingresar</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" style={styles.buttonIcon} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
    backgroundColor: '#667eea',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  topSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  avatarContainer: {
    marginBottom: 30,
  },
  bearHead: {
    position: 'relative',
    alignItems: 'center',
  },
  birrete: {
    position: 'absolute',
    top: -20,
    zIndex: 10,
  },
  birreteTop: {
    width: 80,
    height: 15,
    backgroundColor: '#1a1a1a',
    borderRadius: 40,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  birreteTassel: {
    position: 'absolute',
    right: -10,
    top: -5,
    width: 20,
    height: 25,
    backgroundColor: '#FFD700',
    borderRadius: 10,
    transform: [{ rotate: '15deg' }],
  },
  earsContainer: {
    position: 'absolute',
    top: -10,
    flexDirection: 'row',
    width: 140,
    justifyContent: 'space-between',
    zIndex: 5,
  },
  ear: {
    width: 35,
    height: 35,
    backgroundColor: '#8B4513',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  innerEar: {
    width: 18,
    height: 18,
    backgroundColor: '#CD853F',
    borderRadius: 10,
  },
  face: {
    width: 120,
    height: 120,
    backgroundColor: '#8B4513',
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  eyesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 50,
    position: 'absolute',
    top: 25,
  },
  eye: {
    width: 18,
    height: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pupil: {
    width: 6,
    height: 6,
    backgroundColor: '#000000',
    borderRadius: 3,
  },
  snout: {
    position: 'absolute',
    top: 50,
    alignItems: 'center',
  },
  nose: {
    width: 12,
    height: 8,
    backgroundColor: '#000000',
    borderRadius: 6,
    marginBottom: 5,
  },
  mouth: {
    width: 16,
    height: 8,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    borderWidth: 2,
    borderColor: '#000000',
    borderTopWidth: 0,
  },
  paws: {
    position: 'absolute',
    top: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 90,
  },
  paw: {
    width: 28,
    height: 28,
    backgroundColor: '#8B4513',
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F9FC',
    borderRadius: 15,
    marginBottom: 20,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#E4E9F2',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#2E3A59',
  },
  passwordInput: {
    paddingRight: 45,
  },
  eyeButton: {
    position: 'absolute',
    right: 15,
    padding: 5,
  },
  loginButton: {
    flexDirection: 'row',
    backgroundColor: '#667eea',
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 10,
  },
  buttonIcon: {
    marginLeft: 5,
  },
});
