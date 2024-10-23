package utez.edu.mx.inventario4c.article;

import jakarta.persistence.*;
import utez.edu.mx.inventario4c.category.Category;
import utez.edu.mx.inventario4c.storage.Storage;

@Entity
@Table(name = "article")
public class Article {

    //------------------------------ ATRIBUTOS ------------------------//
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private int id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "on_stock", nullable = false, columnDefinition = "BIGINT DEFAULT 0")
    private long onStock;

    @Column(name = "registered_on", nullable = false)
    private String registeredOn;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @ManyToOne
    @JoinColumn(name = "storage_id", nullable = false)
    private Storage storage;

    //------------------------ CONSTRUCTORES -----------------------//

    //1.-Vacio
    public Article() {
    }

    //2.- Todos los atributos de la clase sin ID
    public Article(String name, String description, long onStock, String registeredOn) {
        this.name = name;
        this.description = description;
        this.onStock = onStock;
        this.registeredOn = registeredOn;
    }

    //3.- Todos los atributos de la clase con las de relacion e ID
    public Article(int id, String name, String description, long onStock, String registeredOn, Category category, Storage storage) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.onStock = onStock;
        this.registeredOn = registeredOn;
        this.category = category;
        this.storage = storage;
    }

    //4.-Todos los atibutos de la clase y relacion sin el ID


    public Article(String name, String description, long onStock, String registeredOn, Category category, Storage storage) {
        this.name = name;
        this.description = description;
        this.onStock = onStock;
        this.registeredOn = registeredOn;
        this.category = category;
        this.storage = storage;
    }

    //5.- Todos los actibutos de la clase con id


    public Article(int id, String name, String description, long onStock, String registeredOn) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.onStock = onStock;
        this.registeredOn = registeredOn;
    }

    //---------------------- GETTERS Y SETTERS --------------------//

    public int getId() {
        return id;
    }

    public void setId(int id) {
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

    public long getOnStock() {
        return onStock;
    }

    public void setOnStock(long onStock) {
        this.onStock = onStock;
    }

    public String getRegisteredOn() {
        return registeredOn;
    }

    public void setRegisteredOn(String registeredOn) {
        this.registeredOn = registeredOn;
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