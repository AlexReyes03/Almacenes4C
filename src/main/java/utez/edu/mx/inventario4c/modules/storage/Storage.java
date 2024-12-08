package utez.edu.mx.inventario4c.modules.storage;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import utez.edu.mx.inventario4c.modules.article.Article;
import utez.edu.mx.inventario4c.modules.category.Category;
import utez.edu.mx.inventario4c.modules.user.User;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "storage")
public class Storage {
    @Id // Identificador del almacén
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private long id;

    // Nombre del almacén
    @NotBlank(message = "El nombre es obligatorio")
    @Pattern(
            regexp = "^A-\\d{3}$",
            message = "El nombre debe empezar por A- y tener 3 números Ej. A-001"
    )
    @Column(name = "name", nullable = false, unique = true)
    private String name;

    // ATRIBUTOS DE RELACIÓN CON OTRAS COLUMNAS
    // Relación con User Uno a Uno
    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", unique = true, nullable = false)
    private User user;


    // Relación con Category Muchos a Uno
    @NotNull(message = "La categoría no puede estar vacía")
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    // Relación con Article Muchos a Muchos
    @ManyToMany
    @JoinTable(
            name = "storage_has_articles",
            joinColumns = @JoinColumn(name = "storage_id"),
            inverseJoinColumns = @JoinColumn(name = "article_id"))
    private List<Article> articles;

    // CONSTRUCTORES
    // Vacío
    public Storage() {
    }

    // Con nombre
    public Storage(String name) {
        this.name = name;
    }

    // Con identificador y nombre
    public Storage(long id, String name) {
        this.id = id;
        this.name = name;
    }

    // Con nombre y atributos de relación
    public Storage(String name, User user, Category category, List<Article> articles) {
        this.name = name;
        this.user = user;
        this.category = category;
        this.articles = articles;
    }

    // Con identificador, nombre y atributos de relación
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

    public void addArticle(Article article) {
        if (this.articles == null) {
            this.articles = new ArrayList<>();
        }
        if (!this.articles.contains(article)) {
            this.articles.add(article);
            article.getStorages().add(this); // Sincroniza bidireccionalmente
        }
    }

    public void removeArticle(Article article) {
        if (this.articles != null && this.articles.contains(article)) {
            this.articles.remove(article);
            article.getStorages().remove(this); // Sincroniza bidireccionalmente
        }
    }


}
