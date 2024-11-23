package utez.edu.mx.inventario4c.modules.article.DTO;

import utez.edu.mx.inventario4c.modules.category.Category;
import utez.edu.mx.inventario4c.modules.storage.Storage;

public class ArticleDTO {
    private long id;
    private String name;
    private String description;
    private Category category;
    private Storage storage;

    // Constructor vacío
    public ArticleDTO() {}

    // Constructor completo
    public ArticleDTO(long id, String name, String description, Category category, Storage storage) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.category = category;
        this.storage = storage;
    }

    // Getters y Setters
    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public Storage getStorage() {
        return storage;
    }

    public void setStorage(Storage storage) {
        this.storage = storage;
    }
}