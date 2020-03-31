module.exports = (code) => {
    var buff = [];

    function output(name, content) {
        buff.push({
            name,
            content,
            official: true,
            code
        });
    }

    function outputUnnoficial(name, content) {
        buff.push({
            name,
            content,
            official: false,
            code
        });
    }

    /* eslint-disable no-duplicate-case */
    switch (code) {
        case 100:
            output("Continue", "The server has received the request headers and the client should proceed to send the request body.");
            break;
        case 101:
            output("Switching protocols", "The requester has asked the server to switch protocols and the server has agreed to do so.");
            break;
        case 102:
            output("Processing", "A WebDAV request may contain many sub-requests involving file operations, requiring a long time to complete the request. This code indicates that the server has received and is processing the request, but no response is available yet.");
            break;
        case 103:
            output("Early hints", "Used to return some response headers before final HTTP message.");
            break;

        case 200:
            output("OK", "Standard response for successful HTTP requests. The actual response will depend on the request method used.  In a GET request, the response will contain an entity corresponding to the requested resource. In a POST request, the response will contain an entity describing or containing the result of the action.");
            break;
        case 201:
            output("Created", "The request has been fulfilled, resulting in the creation of a new resource.");
            break;
        case 202:
            output("Accepted", "The request has been accepted for processing, but the processing has not been completed. The request might or might not be eventually acted upon, and may be disallowed when processing occurs.");
            break;
        case 203:
            output("Non-Authoritative Information *(since HTTP/1.1)*", "The server is a transforming proxy (e.g. a _Web accelerator_) that received a 200 OK from its origin, but is returning a modified version of the origin's response.");
            break;
        case 204:
            output("No Content", "The server successfully processed the request and is not returning any content.");
            break;
        case 205:
            output("Reset Content", "The server successfully processed the request, but is not returning any content. Unlike a 204 response, this response requires that the requester reset the document view.");
            break;
        case 206:
            output("Partial Content (RFC 7233)", "The server is delivering only part of the resource ([byte serving](https://en.wikipedia.org/wiki/Byte_serving)) due to a range header sent by the client. The range header is used by HTTP clients to enable resuming of interrupted downloads, or split a download into multiple simultaneous streams.");
            break;
        case 207:
            output("Multi-Status (WebDAV; RFC 4918)", "The message body that follows is by default an XML message and can contain a number of separate response codes, depending on how many sub-requests were made.");
            break;
        case 208:
            output("Already Reported (WebDAV; RFC 5842)", "The members of a DAV binding have already been enumerated in a preceding part of the (multistatus) response, and are not being included again.");
            break;
        case 226:
            output("M Used (RFC 3229)", "The server has fulfilled a request for the resource, and the response is a representation of the result of one or more instance-manipulations applied to the current instance.");
            break;

        case 300:
            output("Multiple Choices", "Indicates multiple options for the resource from which the client may choose (via agent-driven content negotiation). For example, this code could be used to present multiple video format options, to list files with different filename extensions, or to suggest word-sense disambiguation.");
            break;
        case 301:
            output("Moved Permanently", "This and all future requests should be directed to the given URI.");
            break;
        case 302:
            output("Found (Previously \"Moved temporarily\")", "Tells the client to look at (browse to) another URL. 302 has been superseded by 303 and 307. This is an example of industry practice contradicting the standard. The HTTP/1.0 specification (RFC 1945) required the client to perform a temporary redirect (the original describing phrase was \"Moved Temporarily\"), but popular browsers implemented 302 with the functionality of a 303 See Other. Therefore, HTTP/1.1 added status codes 303 and 307 to distinguish between the two behaviours. However, some Web applications and frameworks use the 302 status code as if it were the 303.");
            break;
        case 303:
            output("See Other *(since HTTP/1.1)*", "The response to the request can be found under another URI using the GET method. When received in response to a POST (or PUT/DELETE), the client should presume that the server has received the data and should issue a new GET request to the given URI.");
            break;
        case 304:
            output("Not Modified (RFC 7232)", "Indicates that the resource has not been modified since the version specified by the request headers If-Modified-Since or If-None-Match. In such case, there is no need to retransmit the resource since the client still has a previously-downloaded copy.");
            break;
        case 305:
            output("Use Proxy *(since HTTP/1.1)*", "The requested resource is available only through a proxy, the address for which is provided in the response. For security reasons, many HTTP clients (such as Mozilla Firefox and Internet Explorer) do not obey this status code.");
            break;
        case 306:
            output("Switch Proxy", "No longer used. Originally meant \"Subsequent requests should use the specified proxy.\"");
            break;
        case 307:
            output("Temporary redirect *(since HTTP/1.1)*", "In this case, the request should be repeated with another URI; however, future requests should still use the original URI. In contrast to how 302 was historically implemented, the request method is not allowed to be changed when reissuing the original request. For example, a POST request should be repeated using another POST request.");
            break;
        case 308:
            output("Permanent redirect (RFC 7538)", "The request and all future requests should be repeated using another URI. 307 and 308 parallel the behaviors of 302 and 301, but do not allow the HTTP method to change. So, for example, submitting a form to a permanently redirected resource may continue smoothly.");
            break;

        case 400:
            output("Bad Request", "The server cannot or will not process the request due to an apparent client error (e.g., malformed request syntax, size too large, invalid request message framing, or deceptive request routing).");
            break;
        case 401:
            output("Unauthorized (RFC 7235)", "Similar to 403 Forbidden, but specifically for use when authentication is required and has failed or has not yet been provided. The response must include a WWW-Authenticate header field containing a challenge applicable to the requested resource. See Basic access authentication and Digest access authentication. 401 semantically means \"unauthorised\", the user does not have valid authentication credentials for the target resource. Note: Some sites incorrectly issue HTTP 401 when an IP address is banned from the website(usually the website domain) and that specific address is refused permission to access a website.");
            break;
        case 402:
            output("Payment Required", "Reserved for future use. The original intention was that this code might be used as part of some form of digital cash or micropayment scheme, as proposed, for example, by GNU Taler, but that has not yet happened, and this code is not usually used. Google Developers API uses this status if a particular developer has exceeded the daily limit on requests. Sipgate uses this code if an account does not have sufficient funds to start a call. Shopify uses this code when the store has not paid their fees and is temporarily disabled. Stripe uses this code for failed payments where parameters were correct, for example blocked fraudulent payments.");
            break;
        case 403:
            output("Forbidden", "The request contained valid data and was understood by the server, but the server is refusing action. This may be due to the user not having the necessary permissions for a resource or needing an account of some sort, or attempting a prohibited action (e.g. creating a duplicate record where only one is allowed). This code is also typically used if the request provided authentication via the WWW-Authenticate header field, but the server did not accept that authentication. The request should not be repeated.");
            break;
        case 404:
            output("Not Found", "The requested resource could not be found but may be available in the future.Subsequent requests by the client are permissible.");
            break;
        case 405:
            output("Method Not Allowed", "A request method is not supported for the requested resource; for example, a GET request on a form that requires data to be presented via POST, or a PUT request on a read-only resource.");
            break;
        case 406:
            output("Not Acceptable", "The requested resource is capable of generating only content not acceptable according to the Accept headers sent in the request. See Content negotiation.");
            break;
        case 407:
            output("Proxy Authentication Required (RFC 7235)", "The client must first authenticate itself with the proxy.");
            break;
        case 408:
            output("Request Timeout", "The server timed out waiting for the request. According to HTTP specifications: \"The client did not produce a request within the time that the server was prepared to wait.The client MAY repeat the request without modifications at any later time.\"");
            break;
        case 409:
            output("Conflict", "Indicates that the request could not be processed because of conflict in the current state of the resource, such as an edit conflict between multiple simultaneous updates.");
            break;
        case 410:
            output("Gone", "Indicates that the resource requested is no longer available and will not be available again. This should be used when a resource has been intentionally removed and the resource should be purged. Upon receiving a 410 status code, the client should not request the resource in the future. Clients such as search engines should remove the resource from their indices. Most use cases do not require clients and search engines to purge the resource, and a \"404 Not Found\" may be used instead.");
            break;
        case 411:
            output("Length Required", "The request did not specify the length of its content, which is required by the requested resource.");
            break;
        case 412:
            output("Precondition Failed (RFC 7232)", "The server does not meet one of the preconditions that the requester put on the request header fields.");
            break;
        case 413:
            output("Payload Too Large (RFC 7231)", "The request is larger than the server is willing or able to process. Previously called \"Request Entity Too Large\".");
            break;
        case 414:
            output("URI Too Long (RFC 7231)", "The URI provided was too long for the server to process. Often the result of too much data being encoded as a query-string of a GET request, in which case it should be converted to a POST request. Called \"Request - URI Too Long\" previously.");
            break;
        case 415:
            output("Unsupported Media Type (RFC 7231)", "The request entity has a media type which the server or resource does not support. For example, the client uploads an image as image/svg+xml, but the server requires that images use a different format.");
            break;
        case 416:
            output("Range Not Satisfiable (RFC 7233)", "The client has asked for a portion of the file (byte serving), but the server cannot supply that portion. For example, if the client asked for a part of the file that lies beyond the end of the file. Called \"Requested Range Not Satisfiable\" previously.");
            break;
        case 417:
            output("Expectation Failed", "The server cannot meet the requirements of the Expect request-header field.");
            break;
        case 418:
            output("I'm a teapot (RFC 2324, RFC 7168)", " The RFC specifies this code should be returned by teapots requested to brew coffee.");
            break;
        case 421:
            output("Misdirected Request(RFC 7540)", "The request was directed at a server that is not able to produce a response (for example because of connection reuse).");
            break;
        case 422:
            output("Unprocessable Entity (WebDAV; RFC 4918)", "The request was well-formed but was unable to be followed due to semantic errors.");
            break;
        case 423:
            output("Locked (WebDAV; RFC 4918)", "The resource that is being accessed is locked.");
            break;
        case 424:
            output("Failed Dependency (WebDAV; RFC 4918)", "The request failed because it depended on another request and that request failed (e.g., a PROPPATCH).");
            break;
        case 425:
            output("Too Early (RFC 8470)", "Indicates that the server is unwilling to risk processing a request that might be replayed.");
            break;
        case 426:
            output("Upgrade Required", "The client should switch to a different protocol such as TLS/1.0, given in the Upgrade header field.");
            break;
        case 428:
            output("Precondition Required (RFC 6585)", "The origin server requires the request to be conditional. Intended to prevent the 'lost update' problem, where a client GETs a resource's state, modifies it, and PUTs it back to the server, when meanwhile a third party has modified the state on the server, leading to a conflict.");
            break;
        case 429:
            output("Too Many Requests (RFC 6585)", "The user has sent too many requests in a given amount of time. Intended for use with rate-limiting schemes.");
            break;
        case 431:
            output("Request Header Fields Too Large (RFC 6585)", "The server is unwilling to process the request because either an individual header field, or all the header fields collectively, are too large.");
            break;
        case 451:
            output("Unavailable For Legal Reasons (RFC 7725)", "A server operator has received a legal demand to deny access to a resource or to a set of resources that includes the requested resource. The code 451 was chosen as a reference to the novel Fahrenheit 451 (see the Acknowledgements in the RFC).");
            break;

        case 500:
            output("Internal Server Error", "A generic error message, given when an unexpected condition was encountered and no more specific message is suitable.");
            break;
        case 501:
            output("Not Implemented", "The server either does not recognize the request method, or it lacks the ability to fulfil the request. Usually this implies future availability (e.g., a new feature of a web-service API).");
            break;
        case 502:
            output("Bad Gateway", "The server was acting as a gateway or proxy and received an invalid response from the upstream server.");
            break;
        case 503:
            output("Service Unavailable", "The server cannot handle the request (because it is overloaded or down for maintenance). Generally, this is a temporary state.");
            break;
        case 504:
            output("Gateway Timeout", "The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.");
            break;
        case 505:
            output("HTTP Version Not Supported", "The server does not support the HTTP protocol version used in the request.");
            break;
        case 506:
            output("Variant Also Negotiates (RFC 2295)", "Transparent content negotiation for the request results in a circular reference.");
            break;
        case 507:
            output("Insufficient Storage (WebDAV; RFC 4918)", "The server is unable to store the representation needed to complete the request.");
            break;
        case 508:
            output("Loop Detected (WebDAV; RFC 5842)", "The server detected an infinite loop while processing the request (sent instead of 208 Already Reported).");
            break;
        case 510:
            output("Not Extended (RFC 2774)", "Further extensions to the request are required for the server to fulfil it.");
            break;
        case 511:
            output("Network Authentication Required (RFC 6585)", "The client needs to authenticate to gain network access. Intended for use by intercepting proxies used to control access to the network (e.g., \"captive portals\" used to require agreement to Terms of Service before granting full Internet access via a Wi-Fi hotspot).");
            break;

            /* END OFFICIAL  */

            /* START UNOFFICIAL */

        case 103:
            outputUnnoficial("Checkpoint", "Used in the resumable requests proposal to resume aborted PUT or POST requests.");
            break;

        case 218:
            outputUnnoficial("This is fine (Apache Web Server)", "Used as a catch-all error condition for allowing response bodies to flow through Apache when ProxyErrorOverride is enabled. When ProxyErrorOverride is enabled in Apache, response bodies that contain a status code of 4xx or 5xx are automatically discarded by Apache in favor of a generic response or a custom response specified by the ErrorDocument directive.");
            break;

        case 419:
            outputUnnoficial("Page Expired (Laravel Framework)", "Used by the Laravel Framework when a CSRF Token is missing or expired.");
            break;
        case 420:
            outputUnnoficial("Method Failure (Spring Framework) [**deprecated**]", "A deprecated response used by the Spring Framework when a method has failed.");
            outputUnnoficial("Enhance Your Calm (Twitter) [**deprecated**]", "Returned by version 1 of the Twitter Search and Trends API when the client is being rate limited; versions 1.1 and later use the 429 Too Many Requests response code instead.");
            break;
        case 430:
            outputUnnoficial("Request Header Fields Too Large (Shopify)", "Used by Shopify, instead of the 429 Too Many Requests response code, when too many URLs are requested within a certain time frame.");
            break;
        case 450:
            outputUnnoficial("Blocked by Windows Parental Controls (Microsoft)", "The Microsoft extension code indicated when Windows Parental Controls are turned on and are blocking access to the requested webpage.");
            break;
        case 498:
            outputUnnoficial("Invalid Token (Esri)", "Returned by ArcGIS for Server. Code 498 indicates an expired or otherwise invalid token.");
            break;
        case 499:
            outputUnnoficial("Token Required (Esri)", "Returned by ArcGIS for Server. Code 499 indicates that a token is required but was not submitted.");
            break;

        case 509:
            outputUnnoficial("Bandwidth Limit Exceeded (Apache Web Server/cPanel)", "The server has exceeded the bandwidth specified by the server administrator; this is often used by shared hosting providers to limit the bandwidth of customers.");
            break;
        case 526:
            outputUnnoficial("Invalid SSL Certificate", "Used by Cloudflare and Cloud Foundry's gorouter to indicate failure to validate the SSL/TLS certificate that the origin server presented.");
            break;
        case 529:
            outputUnnoficial("Site is overloaded", "Used by Qualys in the SSLLabs server testing API to signal that the site can't process the request.");
            break;
        case 530:
            outputUnnoficial("Site is frozen", "Used by the Pantheon web platform to indicate a site that has been frozen due to inactivity.");
            break;
        case 598:
            outputUnnoficial("(Informal convention) Network read timeout error", "Used by some HTTP proxies to signal a network read timeout behind the proxy to a client in front of the proxy.");
            break;

            // IIS
        case 440:
            outputUnnoficial("(IIS) Login Time-out", "The client's session has expired and must log in again.");
            break;
        case 449:
            outputUnnoficial("(IIS) Retry With", "The server cannot honour the request because the user has not provided the required information.");
            break;
        case 451:
            outputUnnoficial("(IIS) Redirect", "Used in Exchange ActiveSync when either a more efficient server is available or the server cannot access the users' mailbox. The client is expected to re-run the HTTP AutoDiscover operation to find a more appropriate server.");
            break;

            // nginx
        case 444:
            outputUnnoficial("(NGINX) No Response", "Used internally to instruct the server to return no information to the client and close the connection immediately.");
            break;
        case 494:
            outputUnnoficial("(NGINX) Request header too large", "Client sent too large request or too long header line.");
            break;
        case 495:
            outputUnnoficial("(NGINX) SSL Certificate Error", "An expansion of the 400 Bad Request response code, used when the client has provided an invalid client certificate.");
            break;
        case 496:
            outputUnnoficial("(NGINX) SSL Certificate Required", "An expansion of the 400 Bad Request response code, used when a client certificate is required but not provided.");
            break;
        case 497:
            outputUnnoficial("(NGINX) HTTP Request Sent to HTTPS Port", "An expansion of the 400 Bad Request response code, used when the client has made a HTTP request to a port listening for HTTPS requests.");
            break;
        case 499:
            outputUnnoficial("(NGINX) Client Closed Request", "Used when the client has closed the request before the server could send a response.");
            break;

            // Cloudflare
        case 520:
            outputUnnoficial("(Cloudflare) Web Server Returned an Unknown Error", "The origin server returned an empty, unknown, or unexplained response to Cloudflare.");
            break;
        case 521:
            outputUnnoficial("(Cloudflare) Web Server Is Down", "The origin server has refused the connection from Cloudflare.");
            break;
        case 522:
            outputUnnoficial("(Cloudflare) Connection Timed Out", "Cloudflare could not negotiate a TCP handshake with the origin server.");
            break;
        case 523:
            outputUnnoficial("(Cloudflare) Origin Is Unreachable", "Cloudflare could not reach the origin server; for example, if the DNS records for the origin server are incorrect.");
            break;
        case 524:
            outputUnnoficial("(Cloudflare) A Timeout Occurred", "Cloudflare was able to complete a TCP connection to the origin server, but did not receive a timely HTTP response.");
            break;
        case 525:
            outputUnnoficial("(Cloudflare) SSL Handshake Failed", "Cloudflare could not negotiate a SSL/TLS handshake with the origin server.");
            break;
        case 526:
            outputUnnoficial("(Cloudflare) Invalid SSL Certificate", "Cloudflare could not validate the SSL certificate on the origin web server.");
            break;
        case 527:
            outputUnnoficial("(Cloudflare) Railgun Error", "Error 527 indicates an interrupted connection between Cloudflare and the origin server's Railgun server.");
            break;
        case 530:
            outputUnnoficial("(Cloudflare) *1xxx*", "(This error code doesn't have a name). Error 530 is returned along with a 1xxx error.");
            break;

            // AWS Elastic Load Balancer
        case 460:
            outputUnnoficial("(AWS ELB) *Timeout Too Soon*", "(This error code doesn't have a name). Client closed the connection with the load balancer before the idle timeout period elapsed. Typically when client timeout is sooner than the Elastic Load Balancer's timeout.");
            break;
        case 463:
            outputUnnoficial("(AWS ELB) *Too Many IPs*", "(This error code doesn't have a name).The load balancer received an X-Forwarded-For request header with more than 30 IP addresses.");
            break;
    }
    return buff;
};
