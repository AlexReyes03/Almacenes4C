package utez.edu.mx.inventario4c.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.inventario4c.auth.DTO.AuthLoginDTO;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {"*"})
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("")
    public ResponseEntity<?> login(@RequestBody AuthLoginDTO authLoginDTO) {
        return authService.login(authLoginDTO);
    }
}
