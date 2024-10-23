package utez.edu.mx.inventario4c.article;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.inventario4c.article.DTO.ArticleQuantityDTO;

@RestController
@RequestMapping("/api/articles")
public class ArticleController {

    //---------------Inyección del servicio-------------------//
    @Autowired
    private ArticleService articleService;

    //-------------Endpoints/rutas de acceso -------------//

    // Traer todos los artículos
    @GetMapping("")
    public ResponseEntity<?> findAll() {
        return articleService.findAll();
    }

    // Traer un artículo por ID
    @GetMapping("/{idArticle}")
    public ResponseEntity<?> findById(@PathVariable("idArticle") long idArticle) {
        return articleService.findById(idArticle);
    }

    // Guardar un nuevo artículo
    @PostMapping("")
    public ResponseEntity<?> save(@RequestBody Article article) {
        return articleService.save(article);
    }

    // Actualizar un artículo existente
    @PutMapping("")
    public ResponseEntity<?> update(@RequestBody Article article) {
        return articleService.update(article);
    }

    // Incrementar el stock de un artículo por cantidad
    @PutMapping("/increment-stock")
    public ResponseEntity<?> incrementStock(@RequestBody ArticleQuantityDTO articleQuantityDTO) {
        return articleService.incrementStock(articleQuantityDTO);
    }

    // Decrementar el stock de un artículo por ID
    @PatchMapping("/decrement-stock/{idArticle}")
    public ResponseEntity<?> decrementStock(@PathVariable("idArticle") long idArticle) {
        try {
            articleService.decrementStock(idArticle);
            return ResponseEntity.ok("Stock decrementado exitosamente.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error al decrementar el stock.");
        }
    }
}
