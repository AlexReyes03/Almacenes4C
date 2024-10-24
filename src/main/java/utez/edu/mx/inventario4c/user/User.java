package utez.edu.mx.inventario4c.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import utez.edu.mx.inventario4c.storage.Storage;
import utez.edu.mx.inventario4c.rol.Rol;

import java.util.List;

@Entity
@Table(name = "user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "surname", nullable = false)
    private String surname;

    @Column(name = "lastname", nullable = false)
    private String lastname;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "username", nullable = false)
    private String username;

    @Column(name = "password", nullable = false)
    private String password;

    // Relación con Rol
    @ManyToOne
    @JoinColumn(name = "id_rol", nullable = false)
    private Rol rol;

    // Relación con Storage (almacenes)
    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private List<Storage> storages;

    // Constructores
    public User() {}

    public User(String name, String surname, String lastname, String email, String username, String password) {
        this.name = name;
        this.surname = surname;
        this.lastname = lastname;
        this.email = email;
        this.username = username;
        this.password = password;
    }

    public User(long id, String name, String surname, String lastname, String email, String username, String password) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.lastname = lastname;
        this.email = email;
        this.username = username;
        this.password = password;
    }

    public User(String name, String surname, String lastname, String email, String username, String password, Rol rol, List<Storage> storages) {
        this.name = name;
        this.surname = surname;
        this.lastname = lastname;
        this.email = email;
        this.username = username;
        this.password = password;
        this.rol = rol;
        this.storages = storages;
    }

    // Getters y Setters
    public long getId() { return id; }

    public String getName() { return name; }

    public String getSurname() { return surname; }

    public String getLastname() { return lastname; }

    public String getEmail() { return email; }

    public String getUsername() { return username; }

    public String getPassword() { return password; }

    public Rol getRol() { return rol; }

    public List<Storage> getStorages() { return storages; }

    public void setId(long id) { this.id = id; }

    public void setName(String name) { this.name = name; }

    public void setSurname(String surname) { this.surname = surname; }

    public void setLastname(String lastname) { this.lastname = lastname; }

    public void setEmail(String email) { this.email = email; }

    public void setUsername(String username) { this.username = username; }

    public void setPassword(String password) { this.password = password; }

    public void setRol(Rol rol) { this.rol = rol; }

    public void setStorages(List<Storage> storages) { this.storages = storages; }
}

