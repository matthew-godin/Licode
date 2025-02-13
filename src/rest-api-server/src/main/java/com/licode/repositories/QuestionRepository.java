package com.licode.repositories;

import co.licode.entities.questions.Question;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface QuestionRepository extends JpaRepository<Question, String> {
    Optional<Question> findById(long id);
}
