package utez.edu.mx.inventario4c.article.DTO;

public class ArticleQuantityDTO {
    private long id, quantity;

    //Constructor vacio
    public ArticleQuantityDTO() {
    }

    //Constructor completo
    public ArticleQuantityDTO(long id, long quantity) {
        this.id = id;
        this.quantity = quantity;
    }

    //Getters and setters
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