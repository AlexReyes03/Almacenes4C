package utez.edu.mx.inventario4c.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    // Obtener todos los usuarios
    @GetMapping("/")
    public ResponseEntity<?> findAll() {
        return userService.findAll();
    }

    // Obtener un usuario por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable long id) {
        return userService.findById(id);
    }

    // Obtener todos los usuarios por Rol
    @GetMapping("/rol/{idRol}")
    public ResponseEntity<?> findAllByRol(@PathVariable int idRol) {
        return userService.findAllByIdRol(idRol);
    }

    // Guardar un nuevo usuario
    @PostMapping("/")
    public ResponseEntity<?> save(@RequestBody User user) {
        return userService.save(user);
    }

    // Actualizar un usuario existente
    @PutMapping("/")
    public ResponseEntity<?> update(@RequestBody User user) {
        return userService.update(user);
    }

    // Eliminar un usuario
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable long id) {
        User user = new User();
        user.setId(id);
        return userService.deleteById(user);
    }
}

