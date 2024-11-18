package utez.edu.mx.inventario4c.modules.category;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {

    List<Category> findAll();

    Category findById(int id);

    Category save(Category category);
}
