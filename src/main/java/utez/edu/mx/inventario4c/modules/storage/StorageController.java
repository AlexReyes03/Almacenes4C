package utez.edu.mx.inventario4c.modules.storage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/storage")
@CrossOrigin(origins = {"http://localhost:5500", "http://127.0.0.1:5500"})
public class StorageController {

    @Autowired
    private StorageService storageService;

    // ENDPOINTS / RUTAS DE ACCESO
    // Traer a todos los almacenes
    @GetMapping("")
    @Secured({"ROLE_ADMIN", "ROLE_EMPLOYEE"})
    public ResponseEntity<?> findAll() {
        return storageService.findAll();
    }

    // Traer almacén por id
    @GetMapping("/{idStorage}")
    @Secured("ROLE_ADMIN")
    public ResponseEntity<?> findById(@PathVariable("idStorage") int idStorage) {
        return storageService.findById(idStorage);
    }

    // Guardar un almacén
    @PostMapping("")
    @Secured("ROLE_ADMIN")
    public ResponseEntity<?> save(@RequestBody Storage storage) {
        return storageService.save(storage);
    }

    // Añadir artículos a un almacén
    @PostMapping("/{idStorage}/add-articles")
    @Secured("ROLE_ADMIN")
    public ResponseEntity<?> addArticlesToStorage(@PathVariable long idStorage, @RequestBody List<Long> articleIds) {
        return storageService.addArticlesToStorage(idStorage, articleIds);
    }

    // Eliminar artículos de un almacén
    @PostMapping("/{idStorage}/remove-articles")
    @Secured("ROLE_ADMIN")
    public ResponseEntity<?> removeArticlesFromStorage(@PathVariable long idStorage, @RequestBody List<Long> articleIds) {
        return storageService.removeArticlesFromStorage(idStorage, articleIds);
    }

    // Actualizar un almacén
    @PutMapping("")
    @Secured("ROLE_ADMIN")
    public ResponseEntity<?> update(@RequestBody Storage storage) {
        return storageService.update(storage);
    }

    // Eliminar un almacén
    @DeleteMapping("")
    @Secured("ROLE_ADMIN")
    public ResponseEntity<?> deleteById(@RequestBody Storage storage) {
        return storageService.deleteById(storage);
    }
}
