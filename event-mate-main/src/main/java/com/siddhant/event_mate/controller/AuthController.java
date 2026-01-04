package com.siddhant.event_mate.controller;

import com.siddhant.event_mate.dto.AuthDto;
import com.siddhant.event_mate.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthDto.AuthResponse> register(
            @RequestBody AuthDto.RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthDto.AuthResponse> login(
            @RequestBody AuthDto.LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/otp/generate")
    public ResponseEntity<String> generateOtp(@RequestBody AuthDto.OtpRequest request) {
        authService.generateOtp(request.getEmail());
        return ResponseEntity.ok("OTP sent successfully");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody AuthDto.OtpRequest request) {
        authService.generatePasswordResetOtp(request.getEmail());
        return ResponseEntity.ok("Password reset OTP sent successfully");
    }

    @PostMapping("/otp/login")
    public ResponseEntity<AuthDto.AuthResponse> loginWithOtp(
            @RequestBody AuthDto.OtpLoginRequest request) {
        return ResponseEntity.ok(authService.loginWithOtp(request));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody AuthDto.ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok("Password reset successfully");
    }
}