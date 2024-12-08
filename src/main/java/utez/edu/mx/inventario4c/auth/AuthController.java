package utez.edu.mx.inventario4c.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.inventario4c.auth.DTO.AuthLoginDTO;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {"http://localhost:8080", "http://127.0.0.1:5500"})
@Validated
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/verifyCurrentPassword")
    public ResponseEntity<?> verifyCurrentPassword(@RequestBody AuthLoginDTO authLoginDTO) {
        return authService.verifyCurrentPassword(authLoginDTO);
    }

    @PostMapping("")
    public ResponseEntity<?> login(@Valid @RequestBody AuthLoginDTO authLoginDTO) {
        return authService.login(authLoginDTO);
    }
}
