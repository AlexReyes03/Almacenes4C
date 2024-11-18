package utez.edu.mx.inventario4c.modules.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = {"*"})
public class UserController {

    @Autowired
    private UserService userService;

    // ENDPOINTS / RUTAS DE ACCESO
    // Traer a todos los usuarios
    @GetMapping("")
    @Secured("ROLE_ADMIN")
    public ResponseEntity<?> findAll() {
        return userService.findAll();
    }

    // Traer un usuario por id de rol
    @GetMapping("rol/{idRol}")
    @Secured({"ROLE_ADMIN", "ROLE_EMPLOYEE"})
    public ResponseEntity<?> findAllByIdRol(@PathVariable("idRol") int idRol) {
        return userService.findAllByIdRol(idRol);
    }

    // Traer un usuario por id
    @GetMapping("/{idUser}")
    @Secured("ROLE_ADMIN")
    public ResponseEntity<?> findById(@PathVariable("idUser") int idUser) {
        return userService.findById(idUser);
    }

    @PostMapping("")
    @Secured("ROLE_ADMIN")
    public ResponseEntity<?> save(@RequestBody User user) {
        return userService.save(user);
    }

    @PutMapping("")
    @Secured("ROLE_ADMIN")
    public ResponseEntity<?> update(@RequestBody User user) {
        return userService.update(user);
    }

    @DeleteMapping("")
    @Secured("ROLE_ADMIN")
    public ResponseEntity<?> deleteById(@RequestBody User user) {
        return userService.deleteById(user);
    }
}
