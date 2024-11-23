package utez.edu.mx.inventario4c.modules.storage.DTO;

import utez.edu.mx.inventario4c.modules.category.Category;
import utez.edu.mx.inventario4c.modules.user.User;

import java.util.List;

public class StorageDTO {
    private long id;
    private String name;
    private User user;
    private Category category;
    private List<Long> articleIds;

    // CONSTRUCTORES

    // Constructor vacío
    public StorageDTO() {}

    // Constructor completo
    public StorageDTO(long id, String name, User user, Category category, List<Long> articleIds) {
        this.id = id;
        this.name = name;
        this.user = user;
        this.category = category;
        this.articleIds = articleIds;
    }

    // GETTERS AND SETTERS

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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public List<Long> getArticleIds() {
        return articleIds;
    }

    public void setArticleIds(List<Long> articleIds) {
        this.articleIds = articleIds;
    }
}
