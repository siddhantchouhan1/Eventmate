package com.siddhant.event_mate;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
@EnableMethodSecurity
public class EventMateApplication {

	public static void main(String[] args) {
		SpringApplication.run(EventMateApplication.class, args);
	}

}
