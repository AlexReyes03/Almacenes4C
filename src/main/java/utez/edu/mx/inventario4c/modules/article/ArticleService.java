
package utez.edu.mx.inventario4c.modules.article;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.inventario4c.modules.article.DTO.ArticleDTO;
import utez.edu.mx.inventario4c.modules.article.DTO.ArticleQuantityDTO;
import utez.edu.mx.inventario4c.modules.storage.Storage;
import utez.edu.mx.inventario4c.utils.CustomResponseEntity;

import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

@Service
public class ArticleService {

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private CustomResponseEntity customResponseEntity;

    public ArticleDTO transformArticleToDTO(Article a) {
        List<Long> storageIds = new ArrayList<>();
        if (a.getStorages() != null) {
            for (Storage storage : a.getStorages()) {
                storageIds.add(storage.getId());
            }
        }

        return new ArticleDTO(
                a.getId(),
                a.getName(),
                a.getDescription(),
                a.getOnStock(),
                a.getCategory() != null ? a.getCategory() : null,
                storageIds
        );
    }

    public List<ArticleQuantityDTO> transformArticlesToDTOs(List<Article> articles) {
        List<ArticleQuantityDTO> list = new ArrayList<>();
        for (Article a : articles) {
            list.add(new ArticleQuantityDTO(a.getId(), a.getOnStock()));
        }
        return list;
    }

    //-------------------------------------MÉTODOS DEL SERVICIO----------------------------------
    //Traer todos los artículos
    @Transactional(readOnly = true)
    public ResponseEntity<?> findAll(){
        List <Article> list = articleRepository.findAll();
        return customResponseEntity.getOkResponse(
                list.isEmpty()? "Aún no hay registros" :"Operación exitosa",
                "OK",
                200,
                list
        );
    }

    //Traer artículo por id
    @Transactional(readOnly = true)
    public ResponseEntity<?> findById(long idArticle) {
        Article found = articleRepository.findById(idArticle);

        if (found == null) {
            return customResponseEntity.get404Response();
        } else {
            ArticleDTO articleDTO = transformArticleToDTO(found); // Transformamos a DTO

            return customResponseEntity.getOkResponse(
                    "Operación exitosa",
                    "OK",
                    200,
                    articleDTO
            );
        }
    }

    //Guardar artículo
    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<?> save(Article article){
        SimpleDateFormat sdf= new SimpleDateFormat("yyyy-MM-dd HH:mm", new Locale("es-MX"));
        Date currentDate= new Date();

        try{
            article.setRegisteredOn(sdf.format(currentDate));
            articleRepository.save(article);
            return customResponseEntity.getOkResponse(
                    "Registro exitoso",
                    "CREATED",
                    201,
                    null
            );
        }catch(Exception e){
            e.printStackTrace();
            System.out.println(e.getMessage());
            return customResponseEntity.get400Response();
        }
    }

    // Guardar una lista de artículos
    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<?> saveAll(List<Article> articles) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm", new Locale("es-MX"));
        Date currentDate = new Date();

        try {
            for (Article article : articles) {
                article.setRegisteredOn(sdf.format(currentDate));
                articleRepository.save(article);
            }

            return customResponseEntity.getOkResponse(
                    "Todos los artículos fueron registrados exitosamente",
                    "CREATED",
                    201,
                    null
            );
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println(e.getMessage());
            return customResponseEntity.get400Response();
        }
    }

    // Actualizar artículo
    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<?> update(Article article) {
        Article found = articleRepository.findById(article.getId());
        if(found == null) {
            return customResponseEntity.get404Response();
        } else {
            try {
                article.setRegisteredOn(found.getRegisteredOn());

                articleRepository.save(article);
                return customResponseEntity.getOkResponse(
                        "Actualización exitosa",
                        "OK",
                        200,
                        null
                );
            } catch (Exception e) {
                e.printStackTrace();
                System.out.println(e.getMessage());
                return customResponseEntity.get400Response();
            }
        }
    }


    //Incrementar el stock de un artículo por una cantidad
    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<?> incrementStockByQuantity(ArticleQuantityDTO data){
        if(articleRepository.findById(data.getId())==null){
            return customResponseEntity.get404Response();
        }else{
            try{
                articleRepository.incrementStockByQuantity(data.getQuantity(), data.getId());
                return customResponseEntity.getOkResponse(
                        "Se aumentó el stock del artículo",
                        "OK",
                        200,
                        null
                );
            }catch(Exception e){
                e.printStackTrace();
                System.out.println(e.getMessage());
                return customResponseEntity.get400Response();
            }
        }
    }

    //Decrementar el stock por id
    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<?> decrementStockById(ArticleQuantityDTO data) {
        Article article = articleRepository.findById(data.getId());
        if (article == null) {
            return customResponseEntity.get404Response();
        }

        long currentStock = article.getOnStock();
        if (data.getQuantity() > currentStock) {
            return customResponseEntity.get400Response();
        }

        try{
            articleRepository.decrementStockById(data.getQuantity(), data.getId());
            return customResponseEntity.getOkResponse(
                    "Se disminuyó el stock del artículo",
                    "OK",
                    200,
                    null
            );
        }catch(Exception e){
            e.printStackTrace();
            System.out.println(e.getMessage());
            return customResponseEntity.get400Response();
        }
    }

    // Eliminar artículo por ID
    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<?> deleteById(Article article) {
        if (articleRepository.findById(article.getId()) == null) {
            return customResponseEntity.get404Response();
        } else {
            try {
                articleRepository.deleteById(article.getId());
                return customResponseEntity.getOkResponse(
                        "Eliminaciòn exitosa",
                        "OK",
                        200,
                        null
                );
            } catch (Exception e) {
                e.printStackTrace();
                System.out.println(e.getMessage());
                return customResponseEntity.get400Response();
            }
        }
    }
}
