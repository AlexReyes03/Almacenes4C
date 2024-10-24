package utez.edu.mx.inventario4c.storage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/storage")
public class StorageController {

    @Autowired
    private StorageService storageService;

    // ENDPOINTS / RUTAS DE ACCESO
    // Traer a todos los almacenes
    @GetMapping("")
    public ResponseEntity<?> findAll() {
        return storageService.findAll();
    }

    @GetMapping("/{idStorage}")
    public ResponseEntity<?> findById(@PathVariable("idStorage") int idStorage) {
        return storageService.findById(idStorage);
    }

    @PostMapping("")
    public ResponseEntity<?> save(@RequestBody Storage storage) {
        return storageService.save(storage);
    }

    @PutMapping("")
    public ResponseEntity<?> update(@RequestBody Storage storage) {
        return storageService.update(storage);
    }

    @DeleteMapping("/{idStorage}")
    public ResponseEntity<?> deleteById(@RequestBody Storage storage) {
        return storageService.deleteById(storage);
    }
}
