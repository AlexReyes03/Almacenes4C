package utez.edu.mx.inventario4c.article;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.inventario4c.article.DTO.ArticleDTO;
import utez.edu.mx.inventario4c.article.DTO.ArticleQuantityDTO;
import utez.edu.mx.inventario4c.utils.CustomResponseEntity;

import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;

@Service
public class ArticleService {

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private CustomResponseEntity customResponseEntity;

    //-------------------- TRANSFORMACIONES DTO ------------------------//
    public ArticleDTO transformToDTO(Article article) {
        return new ArticleDTO(
                article.getId(),
                article.getName(),
                article.getDescription(),
                article.getCategory().getId(),
                article.getStorage().getId()
        );
    }

    //-------------------- MÉTODOS DEL SERVICIO ------------------------//

    // Traer todos los artículos
    @Transactional(readOnly = true)
    public ResponseEntity<?> findAll() {
        List<Article> list = articleRepository.findAll();
        return customResponseEntity.getOkResponse(
                list.isEmpty() ? "No hay registros de artículos" : "Operación exitosa",
                "OK",
                200,
                list
        );
    }

    // Traer un artículo por ID
    @Transactional(readOnly = true)
    public ResponseEntity<?> findById(long idArticle) {
        Article found = articleRepository.findById(idArticle);
        if (found == null) {
            return customResponseEntity.get404Response();
        } else {
            return customResponseEntity.getOkResponse(
                    "Operación exitosa",
                    "OK",
                    200,
                    found
            );
        }
    }

    // Guardar un artículo nuevo
    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<?> save(Article article) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm", new Locale("es-MX"));
        Date curruentDay = new Date();

        try {
            article.setRegisteredOn(sdf.format(curruentDay));
            articleRepository.save(article);
            return customResponseEntity.getOkResponse(
                    "Artículo registrado exitosamente",
                    "CREATED",
                    201,
                    null
            );
        } catch (Exception e) {
            e.printStackTrace();
            return customResponseEntity.get400Response();
        }
    }

    // Actualizar un artículo existente
    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<?> update(Article article) {
        Article found = articleRepository.findById(article.getId());
        if (found == null) {
            return customResponseEntity.get404Response();
        } else {
            try {
                articleRepository.save(article);
                return customResponseEntity.getOkResponse(
                        "Artículo actualizado exitosamente",
                        "OK",
                        200,
                        null
                );
            } catch (Exception e) {
                e.printStackTrace();
                return customResponseEntity.get400Response();
            }
        }
    }

    // Incrementar el stock de un artículo por cantidad
    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<?> incrementStock(ArticleQuantityDTO data) {
        Article article = articleRepository.findById(data.getId());
        if (article == null) {
            return customResponseEntity.get404Response();
        } else {
            try {
                articleRepository.incrementStock(data.getQuantity(), data.getId());
                return customResponseEntity.getOkResponse(
                        "Stock incrementado exitosamente",
                        "OK",
                        200,
                        null
                );
            } catch (Exception e) {
                e.printStackTrace();
                return customResponseEntity.get400Response();
            }
        }
    }

    // Decrementar el stock de un artículo por ID
    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public void decrementStock(long idArticle) {
        Article article = articleRepository.findById(idArticle);
        if (article == null) {
            System.out.println("El ID del artículo no existe.");
        } else {
            try {
                articleRepository.decrementStock(idArticle);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}
