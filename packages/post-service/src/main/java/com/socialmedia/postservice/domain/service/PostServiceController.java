package com.socialmedia.postservice.domain.service;

import com.socialmedia.postservice.domain.service.transverse.ExtractContentFromJson;
import com.socialmedia.postservice.infra.models.Post;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/post-service")
public class PostServiceController {

    @Autowired
    private final PostServiceImpl postService;

    @Autowired
    private final ExtractContentFromJson extractContentFromJson;

    public PostServiceController(PostServiceImpl postService, ExtractContentFromJson extractContentFromJson) {
        this.postService = postService;
        this.extractContentFromJson = extractContentFromJson;
    }

    @PostMapping("/create")
    public ResponseEntity<Post> createPost(@RequestBody Post post){
        post.setId(UUID.randomUUID());
        post.setUserId(post.getUserId());
        postService.savePost(post);
        return new ResponseEntity<>(post, HttpStatus.CREATED);
    }

    @PutMapping("/update/{postId}")
    public ResponseEntity<Post> updatePost(@PathVariable UUID postId, @RequestBody String content){
        String extractedContentFromRequest = extractContentFromJson.with(content);
        Optional<Post> updatedPost = postService.updatePost(postId, extractedContentFromRequest);
        return updatedPost.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(()-> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/{postId}")
    public ResponseEntity<Post> getPost(@PathVariable UUID postId){
        Optional<Post> post = postService.getPost(postId);
        return post.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Post>> getAllPostByUser(@PathVariable UUID userId){
        List<Post> post = postService.getAllPostByUserId(userId);
        if (post.size()<1){
            return new ResponseEntity<>(post,HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(post,HttpStatus.OK);
    }

    @GetMapping("/delete/{postId}")
    public ResponseEntity<UUID> deletePost(@PathVariable UUID postId){
        postService.deletePost(postId);
        return new ResponseEntity<>(postId, HttpStatus.OK);
    }

    @GetMapping("/base/version")
    public void postServiceHealthCheck(){
        System.out.println("POST SERVICE IS READY TO TAKE CALLS");
    }

    @PutMapping("/like/{postId}")
    public ResponseEntity<Post> updatePost(@PathVariable UUID postId){
        Optional<Post> updatedPost = postService.like(postId);
        return updatedPost.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(()-> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
}
