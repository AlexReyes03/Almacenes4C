package utez.edu.mx.inventario4c.modules.category;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/category")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping("")
    @Secured("ROLE_ADMIN")
    public ResponseEntity<Category> findAll() {
        return (ResponseEntity<Category>) categoryService.findAll();
    }

    @GetMapping("/{id}")
    @Secured("ROLE_ADMIN")
    public ResponseEntity<Category> findById(@PathVariable int id) {
        return (ResponseEntity<Category>) categoryService.findById(id);
    }

    @PostMapping("")
    @Secured("ROLE_ADMIN")
    public ResponseEntity<Category> save(@RequestBody Category category) {
        return (ResponseEntity<Category>) categoryService.save(category);
    }

    @PutMapping("")
    @Secured("ROLE_ADMIN")
    public ResponseEntity<Category> update(@RequestBody Category category) {
        return (ResponseEntity<Category>) categoryService.update(category);
    }
}
