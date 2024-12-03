package utez.edu.mx.inventario4c.modules.article;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ArticleRepository extends JpaRepository<Article, Long> {

    List<Article> findAll();

    Article findById(long id);

    Article save (Article article);

    @Modifying
    @Query(value="UPDATE article SET on_stock=on_stock + :quantity WHERE id=:idArticle", nativeQuery=true)
    void incrementStockByQuantity(@Param("quantity")long quantity,@Param("idArticle")long idArticle);

    @Modifying
    @Query(value="UPDATE article SET on_stock=on_stock - :quantity WHERE id=:idArticle", nativeQuery=true)
    void decrementStockById(@Param("quantity")long quantity,@Param("idArticle")long idArticle);

    // Eliminar artículo
    @Modifying
    @Query(value = "DELETE FROM article WHERE id = ?", nativeQuery = true)
    void deleteById(@Param("idArticle") long idArticle);
}
