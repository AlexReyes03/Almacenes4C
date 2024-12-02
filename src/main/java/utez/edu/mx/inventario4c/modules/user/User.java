package utez.edu.mx.inventario4c.modules.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import utez.edu.mx.inventario4c.modules.storage.Storage;
import utez.edu.mx.inventario4c.modules.rol.Rol;

import java.util.List;

@Entity
@Table(name = "user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private long id;

    @NotBlank(message = "El nombre es obligatorio")
    @Pattern(
            regexp = "^([A-ZÁÉÍÓÚÑ]{1}[a-záéíóúñ]+\\s*)*$",
            message = "El nombre debe comenzar con mayúscula y solo puede contener letras"
    )
    @Column(name = "name", nullable = false)
    private String name;

    @NotBlank(message = "El apellido paterno es obligatorio")
    @Pattern(
            regexp = "^([A-ZÁÉÍÓÚÑ]{1}[a-záéíóúñ]+\\s*)*$",
            message = "El apellido paterno debe comenzar con mayúscula y solo puede contener letras"
    )
    @Column(name = "surname", nullable = false)
    private String surname;

    @Pattern(
            regexp = "^([A-ZÁÉÍÓÚÑ]{1}[a-záéíóúñ]+\\s*)*$",
            message = "El apellido materno debe comenzar con mayúscula y solo puede contener letras"
    )
    @Column(name = "lastname")
    private String lastname;

    @NotBlank(message = "El correo electrónico es obligatorio")
    @Email(message = "El correo no tiene un formato válido")
    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @NotBlank(message = "El nombre de usuario es obligatorio")
    @Pattern(
            regexp = "^[a-zA-Z0-9]+$",
            message = "El nombre de usuario solo puede contener letras y números"
    )
    @Column(name = "username", nullable = false)
    private String username;

    @Column(name = "password", nullable = false)
    private String password;

    // Relación con Rol
    @ManyToOne
    @JoinColumn(name = "id_rol", nullable = false)
    private Rol rol;

    // Relación con Storage (almacenes)
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonIgnore
    private Storage storage;

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

    public User(String name, String surname, String lastname, String email, String username, String password, Rol rol, Storage storage) {
        this.name = name;
        this.surname = surname;
        this.lastname = lastname;
        this.email = email;
        this.username = username;
        this.password = password;
        this.rol = rol;
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

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Rol getRol() {
        return rol;
    }

    public void setRol(Rol rol) {
        this.rol = rol;
    }

    public Storage getStorage() {
        return storage;
    }

    public void setStorage(Storage storage) {
        this.storage = storage;
    }
}