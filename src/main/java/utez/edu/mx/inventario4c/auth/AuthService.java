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

    // Autenticar a un usuario con sus credenciales
    @Transactional(readOnly = true)
    public ResponseEntity<?> login(AuthLoginDTO authLoginDTO) {
        User found = userRepository.findByPasswordAndEmailOrUsername(
                authLoginDTO.getPassword(),
                authLoginDTO.getUser()
        );
        if (found == null) {
            return customResponseEntity.get404Response();
        } else {
            try {
                UserDetails userDetails = new UserDetailsImpl(found);

                return customResponseEntity.getOkResponse(
                        "Inicio de sesión exitoso",
                        "OK",
                        200,
                        jwtUtil.generateToken(userDetails)
                );
            } catch (Exception e) {
                System.out.println(e.getMessage());
                logger.error("An error ocurred while loggin in");
                return customResponseEntity.get400Response();
            }
        }
    }
}
