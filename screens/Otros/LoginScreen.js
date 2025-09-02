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

  // Animación de seguimiento del email
  const handleEmailChange = (text) => {
    setEmail(text);
    if (!isPasswordFocused && text.length > 0) {
      // Simular que sigue el texto con movimientos sutiles
      const randomMovement = Math.random() * 0.3 + 0.2;
      Animated.timing(eyeAnimation, {
        toValue: randomMovement,
        duration: 100,
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

  const handleEmailFocus = () => {
    Animated.timing(eyeAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
    setIsPasswordFocused(false);
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
          navigation.navigate('AdminDashboard');
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
      outputRange: [0, 12],
    });

    const handsOpacity = handsAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    const eyeTransformX = eyeAnimation.interpolate({
      inputRange: [-1, 1],
      outputRange: [-10, 10],
    });

    const eyeTransformY = eyeAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -2],
    });

    // Múltiples animaciones para movimientos más fluidos
    const breathingAnimation = useRef(new Animated.Value(0)).current;
    const idleHeadBob = useRef(new Animated.Value(0)).current;
    const nervousAnimation = useRef(new Animated.Value(0)).current;
    const tasselSwing = useRef(new Animated.Value(0)).current;
    const earWiggle = useRef(new Animated.Value(0)).current;
    const headFollowAnimation = useRef(new Animated.Value(0)).current;

    // Respiración sutil constante
    useEffect(() => {
      const breathe = () => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(breathingAnimation, {
              toValue: 1,
              duration: 2500,
              useNativeDriver: true,
            }),
            Animated.timing(breathingAnimation, {
              toValue: 0,
              duration: 2500,
              useNativeDriver: true,
            }),
          ])
        ).start();
      };
      breathe();
    }, []);

    // Movimiento sutil de cabeza cuando no está enfocado
    useEffect(() => {
      if (!isPasswordFocused && email.length === 0) {
        const bobHead = () => {
          Animated.loop(
            Animated.sequence([
              Animated.timing(idleHeadBob, {
                toValue: 1,
                duration: 3000,
                useNativeDriver: true,
              }),
              Animated.timing(idleHeadBob, {
                toValue: -0.5,
                duration: 2000,
                useNativeDriver: true,
              }),
              Animated.timing(idleHeadBob, {
                toValue: 0,
                duration: 2500,
                useNativeDriver: true,
              }),
            ])
          ).start();
        };
        bobHead();
      } else {
        idleHeadBob.stopAnimation();
        idleHeadBob.setValue(0);
      }
    }, [isPasswordFocused, email]);

    // Seguimiento de cabeza mientras escribe email
    useEffect(() => {
      if (email.length > 0 && !isPasswordFocused) {
        const movement = (email.length % 10) / 10; // Movimiento basado en longitud del email
        Animated.spring(headFollowAnimation, {
          toValue: movement,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.spring(headFollowAnimation, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }).start();
      }
    }, [email, isPasswordFocused]);

    // Animación cuando está nervioso (al escribir contraseña)
    useEffect(() => {
      if (isPasswordFocused) {
        // Movimiento nervioso más intenso
        Animated.loop(
          Animated.sequence([
            Animated.timing(nervousAnimation, {
              toValue: 1,
              duration: 150,
              useNativeDriver: true,
            }),
            Animated.timing(nervousAnimation, {
              toValue: -1,
              duration: 150,
              useNativeDriver: true,
            }),
            Animated.timing(nervousAnimation, {
              toValue: 0.5,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(nervousAnimation, {
              toValue: -0.5,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(nervousAnimation, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
          ])
        ).start();
        
        // Mover orejas más intensamente
        Animated.loop(
          Animated.sequence([
            Animated.timing(earWiggle, {
              toValue: 1,
              duration: 120,
              useNativeDriver: true,
            }),
            Animated.timing(earWiggle, {
              toValue: -1,
              duration: 120,
              useNativeDriver: true,
            }),
            Animated.timing(earWiggle, {
              toValue: 0,
              duration: 160,
              useNativeDriver: true,
            }),
          ])
        ).start();
      } else {
        nervousAnimation.stopAnimation();
        nervousAnimation.setValue(0);
        earWiggle.stopAnimation();
        earWiggle.setValue(0);
      }
    }, [isPasswordFocused]);

    // Animación de balanceo de la borla más realista
    useEffect(() => {
      const swing = () => {
        Animated.sequence([
          Animated.timing(tasselSwing, {
            toValue: 1,
            duration: 1800,
            useNativeDriver: true,
          }),
          Animated.timing(tasselSwing, {
            toValue: -0.8,
            duration: 1600,
            useNativeDriver: true,
          }),
          Animated.timing(tasselSwing, {
            toValue: 0.6,
            duration: 1400,
            useNativeDriver: true,
          }),
          Animated.timing(tasselSwing, {
            toValue: -0.3,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(tasselSwing, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]).start(() => swing());
      };
      swing();
    }, []);

    // Interpolaciones más complejas
    const breathingScale = breathingAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.02],
    });

    const idleHeadMovement = idleHeadBob.interpolate({
      inputRange: [-1, 0, 1],
      outputRange: [-2, 0, 1],
    });

    const headFollowMovement = headFollowAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 4],
    });

    // CORRECCIÓN: Se asegura que el valor de rotación sea una cadena
    const tasselRotation = tasselSwing.interpolate({
      inputRange: [-1, 0, 1],
      outputRange: ["-25deg", "10deg", "35deg"],
    });

    const tasselSwingY = tasselSwing.interpolate({
      inputRange: [-1, 0, 1],
      outputRange: [2, 0, -1],
    });

    const nervousShake = nervousAnimation.interpolate({
      inputRange: [-1, 0, 1],
      outputRange: [-3, 0, 3],
    });

    // CORRECCIÓN: Se asegura que el valor de rotación sea una cadena
    const nervousHeadTilt = nervousAnimation.interpolate({
      inputRange: [-1, 0, 1],
      outputRange: ["-2deg", "0deg", "2deg"],
    });

    // CORRECCIÓN: Se asegura que el valor de rotación sea una cadena
    const earRotation = earWiggle.interpolate({
      inputRange: [-1, 0, 1],
      outputRange: ["-8deg", "0deg", "8deg"],
    });

    const earScale = earWiggle.interpolate({
      inputRange: [-1, 0, 1],
      outputRange: [0.95, 1, 1.05],
    });

    return (
      <View style={styles.avatarContainer}>
        <Animated.View
          style={[
            styles.bearHead,
            {
              transform: [
                { translateY: Animated.add(headTransform, idleHeadMovement) },
                { translateX: Animated.add(nervousShake, headFollowMovement) },
                { rotate: nervousHeadTilt },
                { scale: breathingScale }
              ] 
            }
          ]}
        >
          {/* Birrete académico detallado */}
          <View style={styles.birrete}>
            {/* Banda del birrete */}
            <View style={styles.birreteband} />
            {/* Base del birrete */}
            <View style={styles.birreteBase}>
              <View style={styles.birreteBaseRim} />
              <View style={styles.birreteBaseShadow} />
            </View>
            {/* Tapa cuadrada del birrete */}
            <View style={styles.birreteSquareTop}>
              <View style={styles.birreteSquareTopShadow} />
              <View style={styles.birreteSquareTopHighlight} />
            </View>
            {/* Botón central */}
            <View style={styles.birreteButton}>
              <View style={styles.birreteButtonHighlight} />
            </View>
            <Animated.View
              style={[
                styles.birreteTassel,
                { 
                  transform: [
                    { rotate: tasselRotation },
                    { translateY: tasselSwingY },
                  ],
                },
              ]}
            >
              <View style={styles.tasselCord} />
              <View style={styles.tasselEnd}>
                <View style={styles.tasselStrands} />
                <View style={styles.tasselStrands} />
                <View style={styles.tasselStrands} />
              </View>
            </Animated.View>
          </View>

          {/* Orejas de oso más realistas */}
          <View style={styles.earsContainer}>
            <Animated.View
              style={[
                styles.ear,
                {
                  transform: [
                    { rotate: earRotation },
                    { scale: earScale },
                  ],
                },
              ]}
            >
              <View style={styles.earOuter} />
              <View style={styles.innerEar} />
              <View style={styles.earHighlight} />
              <View style={styles.earShadow} />
            </Animated.View>
            <Animated.View
              style={[
                styles.ear,
                {
                  transform: [
                    { rotate: earRotation },
                    { scale: earScale },
                  ],
                },
              ]}
            >
              <View style={styles.earOuter} />
              <View style={styles.innerEar} />
              <View style={styles.earHighlight} />
              <View style={styles.earShadow} />
            </Animated.View>
          </View>

          {/* Cabeza de oso ultra-realista */}
          <Animated.View
            style={[
              styles.face,
              { transform: [{ scale: breathingScale }] },
            ]}
          >
            <View style={styles.furLayer1} />
            <View style={styles.furLayer2} />
            <View style={styles.furLayer3} />
            
            {/* Áreas de luz y sombra */}
            <View style={styles.faceLightArea} />
            <View style={styles.faceShadowArea} />
            <View style={styles.cheeksContainer}>
              <Animated.View
                style={[
                  styles.cheek,
                  {
                    opacity: isPasswordFocused ? 0.9 : 0.4,
                    backgroundColor: isPasswordFocused
                      ? "#FF4757"
                      : "#8B4513",
                    transform: [{ scale: isPasswordFocused ? 1.1 : 1 }],
                  },
                ]}
              />
              <Animated.View
                style={[
                  styles.cheek,
                  {
                    opacity: isPasswordFocused ? 0.9 : 0.4,
                    backgroundColor: isPasswordFocused
                      ? "#FF4757"
                      : "#8B4513",
                    transform: [{ scale: isPasswordFocused ? 1.1 : 1 }],
                  },
                ]}
              />
            </View>

            <View style={styles.eyesContainer}>
              <Animated.View
                style={[
                  styles.eyeSocket,
                  {
                    opacity: blinkAnimation,
                    transform: [
                      { translateX: eyeTransformX },
                      { translateY: eyeTransformY },
                    ],
                  },
                ]}
              >
                <View style={styles.eyeLid} />
                <View
                  style={[
                    styles.eye,
                    {
                      width: isPasswordFocused ? 14 : 22,
                      height: isPasswordFocused ? 14 : 22,
                    },
                  ]}
                >
                  <View style={styles.sclera} />
                  <View style={styles.iris} />
                  <View style={styles.pupil} />
                  <View style={styles.eyeReflection} />
                  <View style={styles.eyeReflection2} />
                </View>
                <View style={styles.eyeLashes} />
                {isPasswordFocused && <View style={styles.worriedBrow} />}
              </Animated.View>
              <Animated.View
                style={[
                  styles.eyeSocket,
                  {
                    opacity: blinkAnimation,
                    transform: [
                      { translateX: eyeTransformX },
                      { translateY: eyeTransformY },
                    ],
                  },
                ]}
              >
                <View style={styles.eyeLid} />
                <View
                  style={[
                    styles.eye,
                    {
                      width: isPasswordFocused ? 14 : 22,
                      height: isPasswordFocused ? 14 : 22,
                    },
                  ]}
                >
                  <View style={styles.sclera} />
                  <View style={styles.iris} />
                  <View style={styles.pupil} />
                  <View style={styles.eyeReflection} />
                  <View style={styles.eyeReflection2} />
                </View>
                <View style={styles.eyeLashes} />
                {isPasswordFocused && <View style={styles.worriedBrow} />}
              </Animated.View>
            </View>

            <View style={styles.snoutContainer}>
              <View style={styles.snout}>
                <View style={styles.snoutBase} />
                <View style={styles.snoutHighlight} />
                <View style={styles.snoutShadow} />
                <View style={styles.nose}>
                  <View style={styles.noseBase} />
                  <View style={styles.noseHighlight} />
                  <View style={styles.noseBridge} />
                  <View style={styles.nostrilLeft} />
                  <View style={styles.nostrilRight} />
                </View>
                <View style={styles.mouthArea}>
                  {isPasswordFocused ? (
                    <View style={styles.worriedMouth}>
                      <View style={styles.worriedMouthShadow} />
                    </View>
                  ) : (
                    <>
                      <View style={styles.mouthLine} />
                      <View style={styles.lipLeft} />
                      <View style={styles.lipRight} />
                    </>
                  )}
                </View>
              </View>
            </View>

            {/* Efectos cuando está nervioso */}
            {isPasswordFocused && (
              <>
                <Animated.View
                  style={[
                    styles.sweatDrop,
                    {
                      top: 25,
                      left: 25,
                      opacity: nervousAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.6, 1],
                      }),
                    },
                  ]}
                />
                <Animated.View
                  style={[
                    styles.sweatDrop,
                    {
                      top: 20,
                      right: 30,
                      opacity: nervousAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.8, 1],
                      }),
                    },
                  ]}
                />
                <View style={styles.nervousLines} />
              </>
            )}
          </Animated.View>

          <Animated.View
            style={[styles.paws, { opacity: handsOpacity }]}
          >
            <Animated.View
              style={[
                styles.paw,
                {
                  transform: [
                    { rotate: "-8deg" },
                    {
                      scale: nervousAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.05],
                      }),
                    },
                  ],
                },
              ]}
            >
              <View style={styles.pawBack} />
              <View style={styles.pawPad} />
              <View style={styles.pawToes}>
                <View style={styles.toe} />
                <View style={styles.toe} />
                <View style={styles.toe} />
              </View>
              <View style={styles.pawShadow} />
            </Animated.View>
            <Animated.View
              style={[
                styles.paw,
                {
                  transform: [
                    { rotate: "8deg" },
                    {
                      scale: nervousAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.05],
                      }),
                    },
                  ],
                },
              ]}
            >
              <View style={styles.pawBack} />
              <View style={styles.pawPad} />
              <View style={styles.pawToes}>
                <View style={styles.toe} />
                <View style={styles.toe} />
                <View style={styles.toe} />
              </View>
              <View style={styles.pawShadow} />
            </Animated.View>
          </Animated.View>
        </Animated.View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
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
            <Ionicons
              name="mail-outline"
              size={20}
              color="#8F9BB3"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor="#8F9BB3"
              value={email}
              onChangeText={handleEmailChange}
              keyboardType="email-address"
              onFocus={handleEmailFocus}
              onBlur={handleInputBlur}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#8F9BB3"
              style={styles.inputIcon}
            />
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
            <Ionicons
              name="arrow-forward"
              size={20}
              color="#FFFFFF"
              style={styles.buttonIcon}
            />
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
    backgroundColor: "#667eea",
  },
  topSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
  },
  avatarContainer: {
    marginBottom: 30,
  },
  bearHead: {
    position: "relative",
    alignItems: "center",
  },
  birrete: {
    position: "absolute",
    top: -25,
    zIndex: 10,
    alignItems: "center",
  },
  birreteBase: {
    width: 90,
    height: 20,
    backgroundColor: "#0a0a0a",
    borderRadius: 45,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 6,
  },
  birreteTop: {
    width: 85,
    height: 12,
    backgroundColor: "#1a1a1a",
    borderRadius: 42,
    position: "absolute",
    top: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  birreteButton: {
    width: 8,
    height: 8,
    backgroundColor: "#333",
    borderRadius: 4,
    position: "absolute",
    top: 6,
  },
  birreteTassel: {
    position: "absolute",
    right: -15,
    top: 0,
    alignItems: "center",
  },
  tasselCord: {
    width: 2,
    height: 20,
    backgroundColor: "#FFD700",
  },
  tasselEnd: {
    width: 12,
    height: 16,
    backgroundColor: "#FFD700",
    borderRadius: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  earsContainer: {
    position: "absolute",
    top: -15,
    flexDirection: "row",
    width: 150,
    justifyContent: "space-between",
    zIndex: 5,
  },
  ear: {
    width: 40,
    height: 40,
    backgroundColor: "#654321",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  innerEar: {
    width: 22,
    height: 22,
    backgroundColor: "#D2691E",
    borderRadius: 11,
  },
  earHighlight: {
    position: "absolute",
    top: 8,
    left: 8,
    width: 8,
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 4,
  },
  face: {
    width: 130,
    height: 130,
    backgroundColor: "#654321",
    borderRadius: 65,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
  faceLightArea: {
    position: "absolute",
    top: 20,
    left: 20,
    width: 40,
    height: 40,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
  },
  cheeksContainer: {
    position: "absolute",
    top: 40,
    flexDirection: "row",
    width: 100,
    justifyContent: "space-between",
  },
  cheek: {
    width: 25,
    height: 20,
    backgroundColor: "#8B4513",
    borderRadius: 12,
    opacity: 0.6,
  },
  eyesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 60,
    position: "absolute",
    top: 30,
  },
  eyeSocket: {
    width: 24,
    height: 24,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  eye: {
    width: 20,
    height: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  iris: {
    position: "absolute",
    width: 12,
    height: 12,
    backgroundColor: "#8B4513",
    borderRadius: 6,
  },
  pupil: {
    width: 6,
    height: 6,
    backgroundColor: "#000000",
    borderRadius: 3,
    zIndex: 2,
  },
  eyeReflection: {
    position: "absolute",
    top: 2,
    left: 3,
    width: 3,
    height: 3,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 1.5,
    zIndex: 3,
  },
    eyeLid: {
    position: "absolute",
    top: -2,
    width: 24,
    height: 8,
    backgroundColor: "#654321",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  snoutContainer: {
    position: "absolute",
    top: 55,
    alignItems: "center",
  },
  snout: {
    width: 45,
    height: 35,
    backgroundColor: "#8B4513",
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  snoutHighlight: {
    position: "absolute",
    top: 5,
    width: 20,
    height: 15,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 10,
  },
  nose: {
    width: 16,
    height: 12,
    backgroundColor: "#000000",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 1,
  },
  noseHighlight: {
    position: "absolute",
    top: 2,
    left: 3,
    width: 4,
    height: 3,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    borderRadius: 2,
  },
  nostril: {
    width: 2,
    height: 4,
    backgroundColor: "#333",
    borderRadius: 1,
    margin: 1,
  },
  mouthArea: {
    marginTop: 5,
    alignItems: "center",
  },
  mouthLine: {
    width: 2,
    height: 8,
    backgroundColor: "#000",
  },
  lipCurve: {
    position: "absolute",
    top: 8,
    width: 8,
    height: 4,
    borderWidth: 1,
    borderColor: "#000",
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  paws: {
    position: "absolute",
    top: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    width: 100,
  },
  paw: {
    width: 35,
    height: 35,
    backgroundColor: "#654321",
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  pawPad: {
    width: 18,
    height: 15,
    backgroundColor: "#2F1B14",
    borderRadius: 9,
    marginBottom: 3,
  },
  pawToes: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 20,
  },
  worriedBrow: {
    position: "absolute",
    top: -8,
    width: 15,
    height: 3,
    backgroundColor: "#654321",
    borderRadius: 2,
    transform: [{ rotate: "15deg" }],
  },
  worriedMouth: {
    width: 12,
    height: 8,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderWidth: 2,
    borderColor: "#000",
    borderBottomWidth: 0,
    marginTop: 5,
  },
  sweatDrop: {
    position: "absolute",
    width: 6,
    height: 8,
    backgroundColor: "#87CEEB",
    borderRadius: 3,
    opacity: 0.8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
  },
  formContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F9FC",
    borderRadius: 15,
    marginBottom: 20,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#E4E9F2",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#2E3A59",
  },
  passwordInput: {
    paddingRight: 45,
  },
  eyeButton: {
    position: "absolute",
    right: 15,
    padding: 5,
  },
  loginButton: {
    flexDirection: "row",
    backgroundColor: "#667eea",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    marginTop: 20,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10,
  },
  buttonIcon: {
    marginLeft: 5,
  },
});
