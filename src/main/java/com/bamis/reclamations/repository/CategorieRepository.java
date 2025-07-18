package com.bamis.reclamations.repository;

import com.bamis.reclamations.model.Categorie;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategorieRepository extends JpaRepository<Categorie, Long> {
}
