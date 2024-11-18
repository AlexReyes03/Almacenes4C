package utez.edu.mx.inventario4c.modules.storage;

import jakarta.persistence.*;
import utez.edu.mx.inventario4c.modules.article.Article;
import utez.edu.mx.inventario4c.modules.category.Category;
import utez.edu.mx.inventario4c.modules.user.User;

import java.util.List;

@Entity
@Table(name = "storage")
public class Storage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private long id;

    @Column(name = "name", nullable = false)
    private String name;

    // ATRIBUTOS DE RELACIÓN CON OTRAS COLUMNAS
    // Relación con User
    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", unique = true)
    private User user;


    // Relación con Category
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    // Relación con Article
    @ManyToMany
    @JoinTable(
            name = "storage_has_articles",
            joinColumns = @JoinColumn(name = "storage_id"),
            inverseJoinColumns = @JoinColumn(name = "article_id"))
    private List<Article> articles;

    // CONSTRUCTORES

    public Storage() {
    }

    public Storage(String name) {
        this.name = name;
    }

    public Storage(long id, String name) {
        this.id = id;
        this.name = name;
    }

    public Storage(String name, User user, Category category, List<Article> articles) {
        this.name = name;
        this.user = user;
        this.category = category;
        this.articles = articles;
    }

    public Storage(long id, String name, User user, Category category, List<Article> articles) {
        this.id = id;
        this.name = name;
        this.user = user;
        this.category = category;
        this.articles = articles;
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

    public List<Article> getArticles() {
        return articles;
    }

    public void setArticles(List<Article> articles) {
        this.articles = articles;
    }
}
