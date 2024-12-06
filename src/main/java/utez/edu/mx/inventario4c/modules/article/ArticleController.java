package utez.edu.mx.inventario4c.modules.article;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.inventario4c.modules.article.DTO.ArticleQuantityDTO;
import utez.edu.mx.inventario4c.modules.storage.Storage;

import java.util.List;

@RestController
@RequestMapping("/api/articles")
@CrossOrigin(origins = {"http://localhost:5500", "http://127.0.0.1:5500"})
public class ArticleController {

    @Autowired
    private ArticleService articleService;

    // Obtener todos los artículos
    @GetMapping("")
    @Secured("ROLE_ADMIN")
    public ResponseEntity<?> findAll() {
        return articleService.findAll();
    }

    // Obtener un artículo por ID
    @GetMapping("/{idArticle}")
    @Secured("ROLE_ADMIN")
    public ResponseEntity<?> findById(@PathVariable("idArticle") long idArticle) {
        return articleService.findById(idArticle);
    }

    // Guardar un nuevo artículo
    @PostMapping("")
    @Secured("ROLE_ADMIN")
    public ResponseEntity<?> save(@RequestBody Article article) {
        return articleService.save(article);
    }

    // Guardar una lista de artículos
    @PostMapping("/batch")
    @Secured("ROLE_ADMIN")
    public ResponseEntity<?> saveAll(@RequestBody List<Article> articles) {
        return articleService.saveAll(articles);
    }

    // Actualizar un artículo existente
    @PutMapping("")
    @Secured("ROLE_ADMIN")
    public ResponseEntity<?> update(@RequestBody Article article) {
        return articleService.update(article);
    }

    // Incrementar el stock de un artículo por cantidad
    @PutMapping("/increment-stock")
    @Secured("ROLE_ADMIN")
    public ResponseEntity<?> incrementStock(@RequestBody ArticleQuantityDTO articleQuantityDTO) {
        return articleService.incrementStockByQuantity(articleQuantityDTO);
    }

    // Decrementar el stock de un artículo por ID
    @PutMapping("/decrement-stock")
    @Secured("ROLE_ADMIN")
    public ResponseEntity<?> decrementStock(@RequestBody ArticleQuantityDTO articleQuantityDTO) {
        return articleService.decrementStockById(articleQuantityDTO);
    }

    // Eliminar un almacén
    @DeleteMapping("")
    @Secured("ROLE_ADMIN")
    public ResponseEntity<?> deleteById(@RequestBody Article article) {
        return articleService.deleteById(article);
    }
}
