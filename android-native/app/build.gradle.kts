plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    // Reads google-services.json (see README.md in this directory for
    // where that file has to come from) and wires the Firebase project
    // config into the build — applied last so it can see the other
    // plugins' outputs.
    id("com.google.gms.google-services")
}

android {
    namespace = "id.web.jalanmenujusurga.app"
    compileSdk = 34

    defaultConfig {
        applicationId = "id.web.jalanmenujusurga.app"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.13.1")
    implementation("androidx.appcompat:appcompat:1.7.0")
    implementation("androidx.webkit:webkit:1.11.0")

    // BOM pins every com.google.firebase:* artifact below to a mutually
    // compatible set of versions — no version number needed on the
    // messaging line itself.
    implementation(platform("com.google.firebase:firebase-bom:33.1.2"))
    implementation("com.google.firebase:firebase-messaging-ktx")
}
