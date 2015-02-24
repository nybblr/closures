MODULE      = usurp
BUILD_DIR   = dist
BUNDLE      = $(BUILD_DIR)/$(MODULE).js

ENTRY = usurp.js

SRC = $(ENTRY)

.PHONY: all clean

all: $(BUNDLE)

clean:
	rm -f $(BUNDLE)

$(BUILD_DIR):
	mkdir -p $(BUILD_DIR)

$(BUNDLE): $(BUILD_DIR) $(SRC)
	browserify $(SRC) -o $@
