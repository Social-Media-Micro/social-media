package com.socialmedia.postservice.infra.repository;

import com.socialmedia.postservice.infra.models.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PostServiceRepository extends JpaRepository<Post, UUID> {
    List<Post> findAllByUserId(UUID userId);
}
