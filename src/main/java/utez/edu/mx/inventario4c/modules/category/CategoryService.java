package utez.edu.mx.inventario4c.modules.category;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.inventario4c.utils.CustomResponseEntity;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private CustomResponseEntity customResponseEntity;


    @Transactional(readOnly = true)
    public ResponseEntity<?> findById(int id){
        Category found = categoryRepository.findById(id);
        String message="";
        if (found ==null){
            return customResponseEntity.get404Response();
        } else{
            message = "Operacion exitosa";
            return customResponseEntity.getOkResponse(message,"OK",200,found);
        }
    }

    @Transactional(readOnly = true)
    public ResponseEntity<?> findAll(){
        List<Category> list = new ArrayList<>();
        String message="";
        if(categoryRepository.findAll().isEmpty()){
            message ="Aun no hay registros";
        } else{
            message = "Operacion exitosa";
            for(Category category : categoryRepository.findAll()){
                list.add(category);
            }
        }
        return customResponseEntity.getOkResponse(message,"OK",200,list);
    }
    @Transactional(rollbackFor = {SQLException.class,Exception.class})
    public ResponseEntity<?> save(Category category){
        try{
            categoryRepository.save(category);
            return customResponseEntity.getOkResponse("OK","OK",200,category);
        }catch(Exception e){
            e.printStackTrace();
            System.out.println(e.getMessage());
            return customResponseEntity.get400Response();
        }
    }

    @Transactional(rollbackFor = {SQLException.class,Exception.class})
    public ResponseEntity<?> update(Category category){
        Category found = categoryRepository.findById(category.getId());
        if(found ==null){
            return customResponseEntity.get404Response();
        }else {
            try {
                categoryRepository.save(category);
                return customResponseEntity.getOkResponse("OK","OK",200,found);
            } catch (Exception e) {
                e.printStackTrace();
                System.out.println(e.getMessage());
                return customResponseEntity.get400Response();
            }

        }
    }





}
