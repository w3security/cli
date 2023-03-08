package main

import (
	"fmt"
	"log"
	"os"
	"path"
	"strings"

	"github.com/w3security/cli/cliv2/internal/utils"
	"github.com/w3security/go-application-framework/pkg/networking/certs"
)

func main() {
	certName := os.Args[1]

	debugLogger := log.Default()

	w3securityDNSNamesStr := os.Getenv("W3SECURITY_DNS_NAMES")
	var w3securityDNSNames []string
	fmt.Println("W3SECURITY_DNS_NAMES:", w3securityDNSNamesStr)
	if w3securityDNSNamesStr != "" {
		w3securityDNSNames = strings.Split(w3securityDNSNamesStr, ",")
	} else {
		// We use app.dev.w3security.io for development
		w3securityDNSNames = []string{"w3security.io", "*.w3security.io", "*.dev.w3security.io"}
	}

	debugLogger.Println("certificate name:", certName)
	debugLogger.Println("W3SECURITY_DNS_NAMES:", w3securityDNSNames)

	certPEMBlockBytes, keyPEMBlockBytes, err := certs.MakeSelfSignedCert(certName, w3securityDNSNames, debugLogger)
	if err != nil {
		log.Fatal(err)
	}

	// certString := certPEMBytesBuffer.String()
	certPEMString := string(certPEMBlockBytes)
	keyPEMString := string(keyPEMBlockBytes)

	keyAndCert := keyPEMString + certPEMString

	// write to file
	certFilePath := path.Join(".", certName+".crt")
	keyFilePath := path.Join(".", certName+".key")
	joinedPemFilePath := path.Join(".", certName+".pem") // key and cert in one file - used by mitmproxy

	_ = utils.WriteToFile(certFilePath, certPEMString)
	_ = utils.WriteToFile(keyFilePath, keyPEMString)
	_ = utils.WriteToFile(joinedPemFilePath, keyAndCert)
}
