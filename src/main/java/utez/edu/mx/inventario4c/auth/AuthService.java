package utez.edu.mx.inventario4c.auth;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.inventario4c.auth.DTO.AuthLoginDTO;
import utez.edu.mx.inventario4c.modules.user.User;
import utez.edu.mx.inventario4c.modules.user.UserDetailsImpl;
import utez.edu.mx.inventario4c.modules.user.UserRepository;
import utez.edu.mx.inventario4c.utils.CustomResponseEntity;
import utez.edu.mx.inventario4c.utils.security.JWTUtil;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    private static final Logger logger = LogManager.getLogger(AuthService.class);

    // INYECCIÓN DE DEPENDENCIAS
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomResponseEntity customResponseEntity;

    @Autowired
    private JWTUtil jwtUtil;

    // Metodo para verificar si la contraseña actual es correcta
    @Transactional(readOnly = true)
    public ResponseEntity<?> verifyCurrentPassword(AuthLoginDTO authLoginDTO) {
        User found = userRepository.findByUsername(authLoginDTO.getUser());
        if (found == null || !found.getPassword().equals(authLoginDTO.getPassword())) {
            return customResponseEntity.get404Response();
        }
        return customResponseEntity.getOkResponse("Contraseña actual verificada correctamente", "OK", 200, null);
    }

    // Autenticar a un usuario con sus credenciales
    @Transactional(readOnly = true)
    public ResponseEntity<?> login(AuthLoginDTO authLoginDTO) {
        User found = userRepository.findByPasswordAndEmailOrUsername(
                authLoginDTO.getPassword(),
                authLoginDTO.getUser()
        );
        if (found == null) {
            return customResponseEntity.get404Response();  // Retorna un 404 si no se encuentra el usuario
        } else {
            try {
                // Crear detalles del usuario
                UserDetails userDetails = new UserDetailsImpl(found);

                // Generar el token JWT
                String jwt = jwtUtil.generateToken(userDetails);

                // Crear la respuesta con el token y los datos del usuario
                Map<String, Object> response = new HashMap<>();
                response.put("token", jwt);
                response.put("user", Map.of(
                        "id", found.getId(),
                        "username", found.getUsername(),
                        "name", found.getName(),
                        "surname", found.getSurname(),
                        "lastname", found.getLastname() != null ? found.getLastname() : "",
                        "email", found.getEmail(),
                        "rol", found.getRol().getName()
                ));

                // Retorna la respuesta con el token y los datos del usuario
                return customResponseEntity.getOkResponse(
                        "Inicio de sesión exitoso",
                        "OK",
                        200,
                        response
                );
            } catch (Exception e) {
                logger.error("Error al iniciar sesión: " + e.getMessage());
                return customResponseEntity.get400Response();  // Si ocurre un error, retorna un 400
            }
        }
    }
}