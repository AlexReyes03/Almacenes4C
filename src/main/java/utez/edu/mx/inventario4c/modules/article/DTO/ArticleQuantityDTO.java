package utez.edu.mx.inventario4c.modules.article.DTO;

public class ArticleQuantityDTO {
    private long id;
    private long quantity;

    // Constructor vacío
    public ArticleQuantityDTO() {}

    // Constructor con parámetros
    public ArticleQuantityDTO(long id, long quantity) {
        this.id = id;
        this.quantity = quantity;
    }

    // Getters y Setters
    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public long getQuantity() {
        return quantity;
    }

    public void setQuantity(long quantity) {
        this.quantity = quantity;
    }
}