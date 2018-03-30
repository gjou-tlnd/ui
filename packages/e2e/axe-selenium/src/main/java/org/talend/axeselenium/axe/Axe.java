package org.talend.axeselenium.axe;

import org.json.JSONArray;
import org.json.JSONObject;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.talend.axeselenium.Reporter;
import org.talend.axeselenium.Script;

import java.util.Map;
import java.util.concurrent.TimeUnit;

public class Axe {
    private WebDriver driver;
    private Script script;
    private Reporter reporter = new Reporter();

    public Axe(final WebDriver driver) {
        this.driver = driver;
        this.script = new Script(driver, Axe.class.getResource("axe.min.js"));
    }

    public JSONObject runWCAG2a() {
        return runWCAG2a(null);
    }

    public JSONObject runWCAG2a(final WebElement element) {
        final Options options = Options.builder().runOnly("tags", "wcag2a").build();
        return run(element, options);
    }

    public JSONObject runWCAG2aa() {
        return runWCAG2aa(null);
    }

    public JSONObject runWCAG2aa(final WebElement element) {
        final Options options = Options.builder().runOnly("tags", "wcag2a", "wcag2aa").build();
        return run(element, options);
    }

    public JSONObject run(final WebElement element, final Options options) {
        this.driver.manage().timeouts().setScriptTimeout(30, TimeUnit.SECONDS);
        this.script.runAxeScript();

        final String axeOptions = options == null ? "{}" : options.toString();
        final String command = String.format(
                "const done = arguments[arguments.length - 1];\n" +
                "function handleResult(error, report) { if (error) { throw error; } return done(report); }\n" +
                "const targetElement = arguments[0] || document;\n" +
                "axe.run(targetElement, %s, handleResult);",
                axeOptions
        );
        final Object response = ((JavascriptExecutor) this.driver).executeAsyncScript(command, element);

        return new JSONObject((Map) response);
    }

    public String reportViolations(final String name, final JSONObject result) {
        final JSONArray violations = result.getJSONArray("violations");
        if (violations.length() > 0) {
            reporter.writeResults(name, result);
            return reporter.report(violations);
        }
        return null;
    }
}
