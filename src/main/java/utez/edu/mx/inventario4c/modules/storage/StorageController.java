package utez.edu.mx.inventario4c.modules.storage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/storage")
public class StorageController {

    @Autowired
    private StorageService storageService;

    // ENDPOINTS / RUTAS DE ACCESO
    // Traer a todos los almacenes
    @GetMapping("")
    @Secured("ROLE_ADMIN")
    public ResponseEntity<?> findAll() {
        return storageService.findAll();
    }

    @GetMapping("/{idStorage}")
    @Secured("ROLE_ADMIN")
    public ResponseEntity<?> findById(@PathVariable("idStorage") int idStorage) {
        return storageService.findById(idStorage);
    }

    @PostMapping("")
    @Secured("ROLE_ADMIN")
    public ResponseEntity<?> save(@RequestBody Storage storage) {
        return storageService.save(storage);
    }

    @PutMapping("")
    @Secured("ROLE_ADMIN")
    public ResponseEntity<?> update(@RequestBody Storage storage) {
        return storageService.update(storage);
    }

    @DeleteMapping("")
    @Secured("ROLE_ADMIN")
    public ResponseEntity<?> deleteById(@RequestBody Storage storage) {
        return storageService.deleteById(storage);
    }
}
